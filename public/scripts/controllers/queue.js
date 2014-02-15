angular.module('ammoApp')

  .controller('QueueController', function($scope, QueueService) {
    
    $scope.songs = QueueService.getQueue(); //Sets the scopes songs to the current q from qservice

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

    /*
      ========== passToPlay ==========
      -Triggered from an ng-click on a song in the queue. Takes an index, sets it as the current song index, 
      then passes it along to the play function.
      
      Params: 
        param1: index (number)

      Return: No return
    */

    $scope.passToPlay = function(index){
      QueueService.setCurrentSongIndex(index);
      $scope.play(index, 'q');
    };
  });