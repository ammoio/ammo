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
      QueueService.setCurrentSongIndex(index)
        .then(function(ind) {
          $scope.play(ind, "q");
        })
        .catch(function(err) {
          console.log("Error: ", err);
        });
    };


     $scope.addToQueue = function($event, song) {
      $event.stopPropagation();
      QueueService.enqueue(song).then(function(song){
        if (QueueService.queue.shareId) {
          $scope.socket.emit('addSong', {
            shareId: QueueService.queue.shareId
          });
        }
      });
    };


    /*
      ========== addTo ==========
      Adds a song to either the queue or a specific

      Params: 
        destination: 
          - 'queue' for the queue or a playlist object

        song:
          - a single song object

        event:
          - Event triggered with the ng-click so we can stop propagation
    */
    $scope.addTo = function(destination, song, event) {
      event.stopPropagation();

      if(destination === 'queue') {
        $scope.addToQueue(event, song);
      }
      else {
        $http({ method: 'POST', url: '/queues/' + destination.shareId + '/add', data: song });
      }
    };

    $scope.remove = function(song, index, event) {
      event.stopPropagation();

      // url: /queues/:id/remove   
      $http.delete('/queues/' + $scope.playlist.shareId + '/' + index);

    };
  });









