angular.module('ammoApp')

  .controller('QueueController', function($scope, QueueService) {
    
    $('#myModal').modal('show');

    QueueService.getQueue().then(function(queue){ //Sets the scopes songs to the current q from qservice
      $scope.songs = queue.songs;
    });

    /*
      ========== share ==========
      -Triggered from a click on the "share" button. Displays modal to prompt for playlist name and passphrase.
        When modal is submitted, trigger QueueService.saveQueue with those inputs.

      Params:
        None

      Return: No return
    */

    $scope.share = function() {
      $('#shareRequestModal').modal();
      $('.shareNow').on('click', function() {
        QueueService.saveQueue($scope.queueName, $scope.passphrase)
        .then(function(queue) {
          $('#shareResponseModal').modal();
          $('.tweetLink').on('click', function() {
              
          });
        });
      });
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