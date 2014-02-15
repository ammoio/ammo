angular.module('ammoApp')

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
  */
  .controller('PlayerController', function($scope, QueueService) {
    $scope.playing = false;
    $scope.currentSong = null;
    $scope.currentSongIndex = null;

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
    $scope.play = function(songOrIndex, queueOrSearch) { //  = 'q' or 's'
      var song;

      if(queueOrSearch === 'q') {
        if(songOrIndex !== null) {
          song = QueueService.queue.songs[songOrIndex];
          $scope.currentSongIndex = songOrIndex;
        }
        else {
          $scope.currentSong = null;
          $scope.playing = false;
          return;
        }
      } 
      else if(queueOrSearch === 's') {
        song = songOrIndex;
      }
      else {
        return;
      }
      $scope.stopAll();
      $scope.currentSong = song;
      $scope.playing = true;

      if(song.service === "youtube") {
        youtube.loadVideoById(song.serviceId, 0, "large");
        youtube.playVideo();
      } 
      else if (song.service === "soundcloud") {
        scPlay(song.serviceId);
      }
    };

    /* 
      ========== $scope.stopAll ==========
      This function is in charge to stop all the services from playing (if any)
    */
    $scope.stopAll = function() {
      $scope.playing = false;
      youtube.pauseVideo();
      scPlayer.pause();
    };

    /* 
      ========== $scope.togglePause ==========
      Toggles play/pause
    */
    $scope.togglePause = function() {
      // If queue is not empty.
      if($scope.currentSong !== null) {
        if($scope.playing) {
          $scope.stopAll();
        }
        else {
          $scope.playing = true;

          if($scope.currentSong.service === 'youtube') {
            youtube.playVideo();
          }
          else if($scope.currentSong.service === 'soundcloud') {
            scPlayer.play();
          }
        }
      }
    };

    // playNext and playPrev can be refactored to one function
    $scope.playNext = function() {
      $scope.currentSongIndex = QueueService.setCurrentSongIndex($scope.currentSongIndex + 1);
      $scope.play($scope.currentSongIndex, "q");
    };

    $scope.playPrev = function() {
      $scope.currentSongIndex = QueueService.setCurrentSongIndex($scope.currentSongIndex - 1);
      $scope.play($scope.currentSongIndex, "q");
    };
});