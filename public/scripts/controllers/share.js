angular.module('ammoApp')
  /*
  ========== ShareController ==========
  This controller is subordinate to FrameController. This is set as the controller when the url is anything 
  variables:

  methods:
    
  */
  .controller('ShareController', function($scope, $location, $routeParams, SearchService, QueueService) {
    //When the share ids match, then update view
    $scope.socket.on('newSongAdded', function (data) {
      if (data.shareId === QueueService.queue.shareId) {
        $scope.refresh();
      }
    });
    $scope.refresh = function() {
      QueueService.getQueue($routeParams.id)
        .then(function(queue){ //Sets the scopes songs to the current q from qservice
          $scope.songs = queue.songs;
        });
      };
      $scope.refresh();
  });