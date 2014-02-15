angular.module('ammoApp')
  .service('QueueService', function($http){
    //TODO - Fix isse #33

    this.queue = []; 
    this.live = false; //flag for whether or not the queue is on the server
    this.id = null;
    this.currentSongIndex = null;

    /*
      ========== enqueue ==========
      Adds a song to the current local queue
      Then if the q is live (this.live=true), it also adds the song to the 
      q on the DB via a post request.

      Params: 
        param1: song (object)
          - a single song object

      Return: No return
    */

    this.enqueue = function(song){
      //if the queue is empty, set currentSongIndex to 0
      this.queue.push(song);
      if (this.live){
        var url = "/queues/" + this.id + "/add";
        $http.post(url, song)
        .success(function(data, status, headers, config){
          console.log("song added to q on db");
        })
        .error(function(error){
          console.log(error);
        });
      }
    };

    /*
      ========== dequeue ==========
      Removes a song from the current queue

      Params: 
        param1: index (number)
          - the index (in the queue) of the song you'd like to dequeue 

      Return: No return
    */

    //TODO - fix issue #20
    this.dequeue = function(index){
      this.queue.splice(index, 1);
    };

    /*
      ========== getQueue ==========
      Returns the current queue

      Params: No Params 

      Return: No return
    */

    this.getQueue = function(){
      return this.queue;
      //need to pull this from the server if live,
      //and reset current song index to the one from the db
      //rethink and refactor this whole process
    };

    /*
      ========== setQueue ==========
      Replaces the current queue with the queue that is passed in as an argurment
      If this q is live (this.live = true), then post the whole q to the database
      via a post request

      Params: 
        param1: newQueue (array)

      Return: No return
    */

    this.setQueue = function(newQueue){
      this.queue = newQueue;
      if (this.live){
        var url = "/queues/" + this.id;
        $http.post(url, {data: this.queue})
        .success(function(data, status, headers, config){
          console.log("q updated db");
        })
        .error(function(error){
          console.log(error);
        });
      }
    };

     /*
      ========== saveQueue ==========
      -Triggered from a click on the "share" button, saves the current queue (this.queue)
       by posting it to the server
        -sets the queue name and passphrase to the arguments passed
        -On a successful save, the server will respond with a shareId
        -this.id gets set to shareID
        -this.live gets set to true

      Params: 
        param1: name (string)
        param2: passphrase (string)

      Return: No return
    */

    this.saveQueue = function(name, passphrase) {
      var newQueue = {
        name: name,
        passphrase: passphrase,
        currentSong: 0,
        songs: this.queue
      };
      var that = this;
      $http.post('/queues', newQueue)
      .success(function(data, status, headers, config) {
        console.log(data);
        that.id = data.shareId;
        that.currentSongIndex = data.currentSong;
        that.live = true;
      })
      .error(function(){
        console.log('post error');
      });
    };

    /*
      ========== setCurrentSongIndex ==========
      -Checks to see if the index passed in is within bounds of this.queue.
      If it is, it sets the currentSongIndex to the new index, and returns the index.
      Else it returns null

      Params: 
        param1: index (number)

      Return: No return
    */

    this.setCurrentSongIndex = function(index){
      if (index >=0 && index < this.queue.length){
        this.currentSongIndex = index;
        return index;
      }else{
        return null;
      }
    };
  });