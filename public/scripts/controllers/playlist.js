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

      if (QueueService.isShuffled){
        QueueService.shuffledIndex = QueueService.shuffleStore.indexOf(index); //inefficient?
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
      $event.preventDefault();
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

    $scope.remove = function(index, event) {
      event.stopPropagation();
      $http.delete('/queues/' + $scope.playlist.shareId + '/' + index);
    };

    $scope.updatePlaylist = function() {
      if(QueueService.queue.shareId === $scope.playlist.shareId) {
        var currentSong = $scope.currentSong;

        for(var i = 0; i < $scope.playlist.songs.length; i++) {
          if($scope.playlist.songs[i] === currentSong) {
            QueueService.queue.currentSong = i;
            QueueService.setNextSongs(i);
            break;
          }
        }
      }
      $scope.$apply();
      $http.put('/queues/' + $scope.playlist.shareId, { songs: $scope.playlist.songs });
    };
});









