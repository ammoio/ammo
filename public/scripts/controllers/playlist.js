angular.module('ammoApp')

  .controller('PlaylistController', function($scope, $http, $routeParams, QueueService) {
    $scope.playlist = null;

    $http.get("/queues/" + $routeParams.id)
      .success(function(playlist){ //Sets the scopes songs to the current q from qservice
        $scope.playlist = playlist;
      }
    );

    $scope.passToPlay = function(index) {
      QueueService.setQueue($scope.playlist);
      console.log(QueueService.queue);
      $scope.play(index, 'q');
    };
  });


   // $scope.passToPlay = function(index){
   //    QueueService.setCurrentSongIndex(index); //needs to happen before scraping

   //    if (QueueService.queue.songs[index].artist){
   //      $scope.loadArtistImages(QueueService.queue.songs[index].artist);
   //    }else{
   //      $scope.artistImage = QueueService.queue.songs[QueueService.queue.currentSong].image;
   //    }
      
   //    $scope.play(index, 'q');
   //  };
