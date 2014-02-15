angular.module('ammoApp')

  .controller('QueueController', function($scope, $routeParams, QueueService) {

    /*
      This code checks if there was an ID included in the route. and
      handles the cases accordingly.
    */

    //If there was a id included as part of the route
    if( $routeParams.id ){
      //Check if the id provided matches whats already loaded in the queue
      if( $routeParams.id === QueueService.queue.shareId ){
        //We do not need to fetch the info from the server, as we already have it.
        $scope.songs = QueueService.queue.songs;
      } else {
        //If it does not match, get the Queue from the server, and set the songs
        QueueService.getQueue($routeParams.id)
        .then(function(queue){
          $scope.songs = queue.songs;
        });
      }
    //If the path did not include an ID
    } else {
      //Check if the current queue is live
      if(QueueService.live){
        //if so, reset the queue to a default
        $scope.songs = QueueService.resetQueue().songs;
      } else {
        //if its not live, keep the existing songs loaded
        $scope.songs = QueueService.queue.songs;
      }
    }



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