angular.module('ammoApp')

  .controller('QueueController', function($scope, $location, QueueService) {
    
    QueueService.getQueue().then(function(queue){ //Sets the scopes songs to the current q from qservice
      $scope.shareId = queue.shareId;
      $scope.songs = queue.songs;
    });

    /*
      ========== share ==========
      -Triggered from a click on the "share" button. Displays modal to prompt for playlist name and passphrase.

      Params:
        None

      Return: No return
    */

    $scope.share = function() {
      $('#shareRequestModal').modal();
    };

    
    /*
      ========== shareRequestModal ==========
      -Called when shareRequestModal is filled out and "Share" is clicked. When modal is submitted, trigger QueueService.saveQueue with those inputs.

      Params:
        None

      Return: No return
    */
    $scope.shareRequestModal = function() {
      QueueService.saveQueue($scope.queueName, $scope.passphrase)
      .then(function(queue) {
        $('#shareResponseModal').modal(); //show response modal
        $scope.shareLink = 'http://localhost/share/' + queue.shareId;
        $('.twitter-share-button').attr({
        'data-url': $scope.shareLink,
        'data-text': "Hey, checkout this playlist I made!\n"
        }); //dynamically set the url
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