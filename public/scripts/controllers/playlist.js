angular.module('ammoApp')

  .controller('PlaylistController', function($scope, $http, $routeParams, QueueService) {
    $scope.playlist = null;

    $http.get("/queues/" + $routeParams.id)
      .success(function(playlist){ 
        $scope.playlist = playlist;
      }
    );


    /* ========== $scope.passToPlay ==========
      Sets the queue to the current playlist (if not set already) and plays the track clicked 
      (song gets played from the QUEUE)

      Params:
        index: index of the song clicked by the user on playlist view (playlist.html) 
    */
    $scope.passToPlay = function(index) {
      if($scope.playlist.shareId !== QueueService.queue.shareId) {
        QueueService.setQueue($scope.playlist);
      }
      $scope.play(index, 'q');
    };
  });