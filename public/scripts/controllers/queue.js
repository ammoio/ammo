angular.module('ammoApp')

  .controller('QueueController', function($scope, QueueService) {
    
    $scope.songs = QueueService.queue; //Sets the scopes songs to the current q from qservice

    $scope.share = function(name, passphrase){
      QueueService.saveQueue(name, passphrase);
    };
  });