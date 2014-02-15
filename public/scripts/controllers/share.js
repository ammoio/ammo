angular.module('ammoApp')
  /*
  ========== ShareController ==========
  This controller is subordinate to FrameController. This is set as the controller when the url is anything 
  variables:

  methods:
    
  */
  .controller('ShareController', function($scope, $location, SearchService, QueueService) {
    QueueService.getQueue($location.path().slice(1)).then(function(queue){ //Sets the scopes songs to the current q from qservice
      $scope.songs = queue.songs;
    });
  });