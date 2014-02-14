angular.module('ammoApp')

  .controller('QueueController', function($scope, QueueService) {
    
    $scope.songs = QueueService.queue;

    $scope.play = function(song){
      console.log(song);
    }

  });