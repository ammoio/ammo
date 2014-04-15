angular.module('ammoApp')
  .service('QueueService', function ($window, $http, $q, $location, ScraperService) {

    this.queue = {
      name: "Now Playing",
      shareId: null,
      listenId: null,
      passphrase: null,
      songs: [],
      currentSong: null, // an Index
      isPrivate: false
    };
    this.live = false; //flag for whether or not the queue is on the server
    this.currentImage = "";
    this.nextSongs = [];
    this.isShuffled = false;
    this.shuffleStore = [];
    this.shuffledIndex = 0;
    this.isLooping = false;
    this.votedSongs = {};

    /*
      ========== enqueue ==========
      Adds a song to the current local queue
      Then if the q is live (this.live=true), it also adds the song to the
      q on the DB via a post request.

      Params:
        param1: song (object)
          - a single song object

      Return:
        A promise that is resolved when the q is updated on the server
        The song that was added is passed to the promise.
    */

    this.enqueue = function (song) {
      song.votes = 0;

      var d = $q.defer();
      //if the queue is empty, set currentSongIndex to 0
      if (this.queue.songs.length === 0) {
        this.setCurrentSongIndex(0);
      }
      this.queue.songs.push(song);
      if (this.live || this.queue.shareId) {
        var url = "/queues/" + this.queue.shareId + "/add";
        $http.post(url, song)
          .success(function (data) {
            d.resolve(data);
          })
          .error(function (err) {
            console.log(err);
            d.reject(err);
          });
      } else {
        d.resolve(song);
      }
      return d.promise;
    };

    /*
      ========== dequeue ==========
      Removes a song from the current queue. Also removes on the server if the queue is live

      Params:
        param1: index (number)
          - the index (in the queue) of the song you'd like to dequeue

      Return:
              the promise that is resolved with the song that was removed on the server.
    */

    this.removeSongAtIndex = function (index) {
      var d = $q.defer();
      var that = this;
      var removed = this.queue.songs.splice(index, 1);

      if (this.live || this.queue.shareId) {
        $http['delete']('/queues/' + this.queue.shareId + '/' + index)
          .success(function (data) {
            that.setNextSongs(that.queue.currentSong);
            d.resolve(data);
          })
          .error(function (err) {
            d.reject(err);
          });

      } else {
        d.resolve(removed);
      }

      return d.promise;
    };

    /*
      ========== getQueue ==========
      Gets the queue from the server by shareId, and sets it to the current queue using the setQueue method.
      The queue is always live when this is run

      Params: shareId - the shareId of the queue you want to get

      Return: Promise that is resolved with the fetched queue upon success
    */

    this.getQueue = function (shareId) {
      var d =  $q.defer();
      if (shareId) {
        this.live = true;
      }

      var that = this;

      $http.get('/queues/' + shareId)
        .success(function (queue) {
          that.setQueue(queue);
          that.setNextSongs(that.queue.currentSong);
          d.resolve(that.queue);
        })
        .error(function (err) {
          console.log("error fetching queue", err);
          d.reject(err);
        });

      return d.promise;
    };

    /*
      ========== setQueue ==========
      Replaces the current queue with the queue that is passed in as an argurment
      If this q is live (this.live = true), then post the whole q to the database
      via a post request

      Params:
        param1: newQueue (array)

      Return: return the queue that has been set
    */

    this.setQueue = function (newQueue) {
      this.queue = newQueue;
      this.setNextSongs(this.queue.currentSong);
      return this.queue;
    };

    this.setPlaylist = function (newQueue) {
      newQueue = $.extend(true, {}, newQueue);
      this.queue = newQueue;
      this.setNextSongs(this.queue.currentSong);
      this.live = false;
      this.queue.shareId = null;
      this.queue.name = "Now Playing";
      return this.queue;
    };

    /*
      ========== resetQueue ==========
      Replaces the current queue with a default empty queue.

      Params:
        none

      Return: return the queue that has been set
    */

    this.resetQueue = function () {
      this.queue = {
        name: "Now Playing",
        shareId: null,
        passphrase: null,
        songs: [],
        currentSong: null
      };
      return this.queue;
    };

    /*
      ========== updateQueue ==========
      Updates the queue on the server. Will only upddate properties that are passed.

      Params:
        param1: propertiesToUpdate.

      Return:
        A promise that will resolve with the newly updated queue
    */

    this.updateQueue = function (propertiesToUpdate) {
      var d = $q.defer();
      var that = this;
      if (this.live || this.queue.shareId) {
        var url = "/queues/" + this.queue.shareId;
        $http.put(url, propertiesToUpdate)
          .success(function (data) {
            that.queue = data;
            that.setNextSongs(that.queue.currentSong);
            d.resolve(that.queue);
          })
          .error(function (err) {
            console.log(err);
            d.reject(err);
          });
      } else {
        angular.extend(this.queue, propertiesToUpdate);
        d.resolve(this.queue);
      }

      return d.promise;
    };

     /*
      ========== saveQueue ==========
      -Triggered from a click on the "share" button, saves the current queue (this.queue)
       by posting it to the server
        -sets the queue name and passphrase to the arguments passed
        -On a successful save, the server will respond with a shareId
        -this.queue.shareId gets set to shareID
        -this.live gets set to true

      Params:
        param1: name (string)

      Return: Promise resolved with the newly created queue
    */

    this.saveQueue = function (name) {
      var d = $q.defer();
      this.queue.name = name || "Untitled";

      var that = this;
      this.queue.isPrivate = false;
      $http.post('/queues', this.queue)
        .success(function (data) {
          that.queue = data;
          that.live = true;

          //if this is coming from a share view
          if ($location.path().indexOf('/q/') !== -1) {
            var url = 'http://' + $location.host() + '/listen/' + data.listenId;
            $window.location.href = url;
          } else {
            $location.path("/listen/" + data.listenId);
            d.resolve(that.queue);
          }
        })
        .error(function (err) {
          console.log('post error', err);
          d.reject(err);
        });

      return d.promise;
    };

    /*
      ========== setCurrentSongIndex ==========
      Checks to see if the index passed in is within bounds of this.queue.
      If it is, it sets the currentSong to the new index, and returns the index.
      Else it returns null

      Return: Promise that resolves with the new song index
    */

    this.setCurrentSongIndex = function (index) {
      var d = $q.defer();
      var that = this;

      if (this.isLooping) {
        if (index >= this.queue.songs.length) {
          index = 0;
        } else if (index < 0) {
          index = this.queue.songs.length - 1;
        }
      }

      if (index >= 0 && index < this.queue.songs.length) {
        this.queue.currentSong = index;
        this.setNextSongs(index);
        if (!this.queue.isPrivate && (this.live || this.queue.shareId)) {
          this.updateQueue({currentSong: index})
            .then(function () {
              d.resolve(that.queue.currentSong);
            })
            .catch(function (err) {
              d.reject(err);
            });
        } else {
          d.resolve(that.queue.currentSong);
        }
      } else {
        d.reject("Should pass in a valid index");
      }

      return d.promise;
    };

    /*
      ========== loadArtistImages ==========
      -Checks the scraper service to see if the artist passed in has been scraped before. If it
      has, it will set the $scope.artistImage to the previously scraped images. If the artists
      has not been scraped, it will call the ScraperService.scrape(artist) function, will set
      the scope.artistImage to the results, or if there are no results, then to the song.image.

      Params:
        param1: artist(string)

      Return: No return
    */

    this.loadArtistImages = function (song) {
      var that = this;

      if (ScraperService.scraped[song.artist]) {
        that.setArtistImage(song);
      } else {
        ScraperService.scrape(song.artist)
          .then(function () {
            that.setArtistImage(song);
          });
      }
    };


    this.rearrangeQueue = function () {
      var newSongs;
      var oldSongs;
      if (this.queue.currentSong === null) {
        oldSongs = [];
        newSongs = this.queue.songs.slice(0); //splice(0, this.queue.songs.length);
      } else {
        oldSongs = this.queue.songs.slice(0, this.queue.currentSong + 1);
        newSongs = this.queue.songs.slice(this.queue.currentSong + 1); //splice(this.queue.currentSong + 1, this.queue.songs.length - this.queue.currentSong);
      }
      newSongs.sort(function (a, b) {
        return b.votes - a.votes;
      });
      this.queue.songs = oldSongs.concat(newSongs);
    };

    /*
      ========== setArtistImage ==========
      -sets the $scope.artistImage to a random image from the scraper, or the song.image

      Params:
        param1: artist(string)

      Return: No return
    */

    this.setArtistImage = function (song) {
      var rand = Math.floor(Math.random() * 4);
      var scraped = ScraperService.scraped;
      var currentImg = scraped[song.artist] ? scraped[song.artist].images[rand] : song.image;

      if (currentImg === "" || currentImg === null) {
        this.currentImage = song.image;
      } else {
        this.currentImage = currentImg;
      }
    };


    /*
      ========== setNexts ==========
      - Get the next 5 (or remaining) songs of the queue

      Params:
        index: index of the current song playing
    */
    this.setNextSongs = function (index) {
      var i;
      if (this.isShuffled) {
        var temp = this.shuffleStore.slice(this.shuffledIndex + 1, this.shuffledIndex + 6);
        this.nextSongs = [];
        for (i = 0; i < temp.length; i++) {
          this.nextSongs.push(this.queue.songs[temp[i]]);
        }

      } else {
        this.nextSongs = this.queue.songs.slice(index + 1, index + 6);
      }
    };
  });