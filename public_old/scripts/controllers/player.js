angular.module('ammoApp.player', [
  'ammoApp.services.queue'
])

  /*
    ========== PlayerController ==========
    This controller has all the logic of the player, needs QueueService
    as a dependencie.

    Functions:
      - $scope.play(songOrIndex, queueOrSearch)
      - $scope.stopAll();
      - $scope.togglePause();
      - $scope.playNext();
      - $scope.playPrev();
      - $scope.detectYoutubeAd();
  */
  .controller('PlayerController', function ($scope, $interval, QueueService) {
    $scope.QueueService = QueueService;
    $scope.playing = false;
    $scope.shuffled = QueueService.isShuffled;
    $scope.looping = QueueService.isLooping;
    $scope.currentSong = null;
    $scope.buffering = false;
    $scope.timer = 0;
    $scope.ready = false;
    /*
      ========== $scope.play ==========
      This functino is in charge of playing songs from all the services.

      Params:
        songsOrIndex
          - This variable depends of who cals the $scope.play() function, if
            the queue controller calls it then it's the index of the queue array
            in the QueueService that contains all the queue songs. $scope.play()
            will play the song in that specific index of the queue array.

            If the function is called from the search controller then it's a song
            object and this function will play it.

        queueOrSearch
          - This variable defines who called this function, 'q' refers for queue
            and 's' for search.
    */
    $scope.play = function (songOrIndex, queueOrSearch) { //  = 'q' or 's'
      $('#youtube').addClass('hideYoutube');
      var song;
      $scope.buffering = true;
      $scope.ready = false;

      song = $scope.setSong(songOrIndex, queueOrSearch);
      if ($scope.currentSong !== null) {
        $scope.stopAll();
        $scope.playing = true;
        $scope.startPlaying(song);
        $scope.setServiceColor();
        $scope.stopTimer();
        $scope.startTimer();
      }
    };

    $scope.setSong = function (songOrIndex, queueOrSearch) {
      if (queueOrSearch === 'q') {
        if (songOrIndex !== null) {
          var song = QueueService.queue.songs[songOrIndex];
          QueueService.queue.currentSong = songOrIndex;
          $scope.currentSong = song;
          $scope.updateImage(songOrIndex);
          return song;
        } else {
          $scope.currentSong = null;
          $scope.playing = false;
          return;
        }
      } else if (queueOrSearch === 's') {
        $scope.updateImage(songOrIndex);
        $scope.currentSong = songOrIndex;
        return songOrIndex;
      }
      return;
    };

    $scope.startPlaying = function (song) {
      if (song.service === "youtube") {
        $('#youtube').removeClass('hideYoutube');
        youtube.loadVideoById(song.serviceId, 0, "large");
        youtube.playVideo();
      } else if (song.service === "soundcloud") {
        scPlay(song.serviceId);
      // } else if (song.service === "deezer") {
        // DZ.player.playTracks([song.serviceId]);
      } else if (song.service === 'rdio') {
        R.player.play({ source: song.serviceId });
        if (!R.currentUser.get('canStreamHere')) { //if not logged in
          $scope.currentSong.duration = 30;
        }
      }
    };

    $scope.setServiceColor = function () {
      var color;
      if ($scope.currentSong.service === 'youtube') {
        color = "#c22f2a";
      } else if ($scope.currentSong.service === 'soundcloud') {
        color = "#e19f32";
      } else if ($scope.currentSong.service === 'rdio') {
        color = '#2d8dbb';
      } else {
        color = '#6beb2e';
      }

      $('.accentColor').css('color', color);
      $('.accentBgColor').css('background-color', color);
    };

    /*
      ========== $scope.stopAll ==========
      This function is in charge to stop all the services from playing (if any)
    */
    $scope.stopAll = function () {
      $scope.playing = false;
      youtube.pauseVideo();
      scPlayer.pause();
      // DZ.player.pause();
      R.player.pause();
    };

    /*
      ========== $scope.togglePause ==========
      Toggles play/pause
    */
    $scope.togglePause = function () {
      // If queue is not empty.
      if ($scope.currentSong !== null) {
        if ($scope.playing) {
          $scope.stopAll();
        } else {
          $scope.unPause();
        }
      } else {
        if (QueueService.queue.songs.length) {
          $scope.play(0, 'q'); //if there are songs in the q and current song is null, play index 0
        }
      }
    };

    $scope.unPause = function () {
      $scope.playing = true;

      if ($scope.currentSong.service === 'youtube') {
        youtube.playVideo();
      } else if ($scope.currentSong.service === 'soundcloud') {
        scPlayer.play();
      // } else if ($scope.currentSong.service === 'deezer') {
        // DZ.player.play();
      } else if ($scope.currentSong.service === 'rdio') {
        R.player.play();
      }
    };

    // playNext and playPrev can be refactored to one function
    $scope.playNext = function () {
      var next = $scope.setNext();

      QueueService.setCurrentSongIndex(next)
        .then(function (index) {
          $scope.updateImage(index);
          $scope.play(index, "q");
        })
        .catch(function (err) {
          console.log("Error: ", err);
        });
    };

    $scope.setNext = function () {
      var next;
      if ($scope.shuffled) {
        if (QueueService.shuffledIndex < QueueService.shuffleStore.length - 1) {
          next = QueueService.shuffleStore[QueueService.shuffledIndex + 1];
          QueueService.shuffledIndex += 1;
        } else if ($scope.looping) {
          next = QueueService.shuffleStore[0];
          QueueService.shuffledIndex = 0;
        }
      } else {
        var cur = QueueService.queue.currentSong;
        next = (cur === null) ? 0 : cur + 1;
      }
      return next;
    };

    $scope.playPrev = function () {
      var prev = $scope.setPrev();

      QueueService.setCurrentSongIndex(prev)
        .then(function (index) {
          $scope.updateImage(index);
          $scope.play(index, "q");
        })
        .catch(function (err) {
          console.log("Error: ", err);
        });
    };

    $scope.setPrev = function () {
      var prev;
      if ($scope.shuffled) {
        if (QueueService.shuffledIndex > 0) {
          prev = QueueService.shuffleStore[QueueService.shuffledIndex - 1];
          QueueService.shuffledIndex -= 1;
        } else if ($scope.looping) {
          prev = QueueService.shuffleStore[QueueService.shuffleStore.length - 1];
          QueueService.shuffledIndex = QueueService.shuffleStore.length - 1;
        }
      } else {
        prev = QueueService.queue.currentSong - 1;
      }

      return prev;
    };

    /* 
      ========== $scope.detectManualPause ==========
      This function detects if a user clicks in the youtube Video
      and pause our player when youtube pauses. 
    */
    $scope.detectManualPause = function () {
      if($scope.currentSong.service === 'youtube') {
        $scope.playing = false;
      }
    };

    $scope.fixTime = function (seconds) {
      if (!seconds) {
        return "0:00";
      }
      var mins = (seconds / 60) | 0;
      var secs = seconds % 60;

      if (secs < 10) {
        secs = "0" + secs;
      }
      return mins + ":" + secs;
    };

    // ---------- Progress Bar Logic ----------
    // ========================================
    var intervals = []; //array to keep track of all set intervals

    $scope.startTimer = function () {
      intervals.push($interval(function () {
        if ($scope.playing && $scope.ready && !$scope.buffering && $scope.timer < $scope.currentSong.duration) {
          $scope.timer += 1;

          // $('.progress-line').css({ width: ($scope.timer * 100 / $scope.currentSong.duration).toFixed(2) + "%" });
          $('.progress-line').animate({ width: ($scope.timer * 100 / $scope.currentSong.duration).toFixed(2) + "%" }, 900);
        }
      }, 1000));
    };

    $scope.stopTimer = function () {
      var i;
      for (i = 0; i < intervals.length; i++) { //clear all set intervals
        $interval.cancel(intervals[i]);
      }
      $scope.timer = 0;
    };

    /*
      ========== playFromSidebar ==========
      -Triggered from an ng-click on a song in the queue. Takes an index, sets it as the current song index, 
      then passes it along to the play function.

      Params:
        param1: index (number)

      Return: No return
    */

    $scope.playFromSidebar = function (index) {
      if (QueueService.isShuffled) {
        QueueService.shuffledIndex = QueueService.shuffledIndex + index + 1;
        index = QueueService.shuffleStore[QueueService.shuffledIndex];
      } else {
        index = QueueService.queue.currentSong + index + 1;
      }

      QueueService.setCurrentSongIndex(index)
        .then(function (ind) {
          $scope.updateImage(ind);
          $scope.play(ind, "q");
        })
        .catch(function (err) {
          console.log("Error: ", err);
        });
    };

    $scope.updateImage = function (songOrIndex) {
      QueueService.currentImage = "";

      song = $scope.getSong(songOrIndex);

      if (song.service === 'youtube'){
        return;
      }else{
        if (song.artist) {
          QueueService.loadArtistImages(song);
        } else {
          QueueService.artistImage = song.image;
        }
      }
    };

    $scope.getSong = function(songOrIndex){
      return (typeof songOrIndex === 'number') ? QueueService.queue.songs[songOrIndex] : songOrIndex;
    };

    $scope.shuffle = function () {
      var shuffled = [];
      var j;

      for (j = 0; j < QueueService.queue.songs.length; j++) {
        shuffled.push(j);
      }

      var len = shuffled.length, temp, i;
      while (len) {
        i = Math.floor(Math.random() * len--);
        temp = shuffled[len];
        shuffled[len] = shuffled[i];
        shuffled[i] = temp;
      }

      QueueService.shuffleStore = shuffled;
      QueueService.shuffledIndex = 0;
    };

    $scope.toggleShuffle = function () {
      if (QueueService.queue.songs.length) {
        QueueService.isShuffled = QueueService.isShuffled ? false : true;
        $scope.shuffled = QueueService.isShuffled;

        if ($scope.shuffled) {
          $scope.shuffle();
        } else {
          QueueService.shuffleStore = [];
        }

        if (QueueService.queue.currentSong === null) {
          QueueService.setCurrentSongIndex(0); // updates the sidebar next songs
        } else {
          QueueService.setCurrentSongIndex(QueueService.queue.currentSong);
        }
      }
    };

    $scope.toggleLoop = function () {
      QueueService.isLooping = QueueService.isLooping ? false : true;
      $scope.looping = QueueService.isLooping;
    };

  });
