angular.module('ammoApp')

  .controller('PlayerController', function($scope) {
    $scope.playing = false;
    $scope.currentSong = null;


    $scope.play = function(song) {
      console.log(song);
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

    // TODO: Issue #27
    $scope.playNext = function() {
      console.log("Play Next!");
    };

    //TODO: Issue #28
    $scope.playPrev = function() {
      console.log("Play Prev!");
    };

    var song = 
    {
      url: "http://www.youtube.com/watch?v=vBmUOt8ErJg",
      service: "youtube",
      serviceId: "vBmUOt8ErJg",
      title: "Random Title",
      artist: null, //Optional param
      duration: 180 //in Seconds
    };

    setTimeout(function() { $scope.play(song); }, 6000);
});