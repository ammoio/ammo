angular.module('ammoApp')

  .controller('QueueController', function($scope, QueueService) {
    
    $scope.songs = QueueService.queue; //Sets the scopes songs to the current q from qservice

    /*
      ========== share ==========
      -Triggered from a click on the "share" button, passes the inputs name and passphrase
      to the queueService saveQueue function, the end result of which should be a post to the 
      server

      Params: 
        param1: name (string)
        param2: passphrase (string)

      Return: No return
    */

    $scope.share = function(name, passphrase){
      QueueService.saveQueue(name, passphrase);
    };
  });