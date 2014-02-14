angular.module('ammoApp')

  .controller('PlayerController', function($scope, QueueService) {
    $scope.playing = false;
    $scope.currentSong = null;
    $scope.currentSongIndex = null;


    $scope.play = function(songOrIndex, queueOrSearch) { //  = 'q' or 's'
      var song;

      if(queueOrSearch === 'q') {
        if(songOrIndex !== null) {
          song = QueueService.queue[songOrIndex];
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

    $scope.stopAll = function() {
      $scope.playing = false;
      youtube.pauseVideo();
      scPlayer.pause();
    };

    $scope.togglePause = function() {
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