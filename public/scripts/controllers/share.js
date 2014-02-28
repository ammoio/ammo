angular.module('ammoApp')
  /*
  ========== ShareController ==========
  This controller is subordinate to FrameController. This is set as the controller when the url is anything 
  variables:

  methods:

  */
  .controller('ShareController', function($scope, $location, $routeParams, SearchService, QueueService) {
    $scope.voted = false;
    //When the share ids match, then update view
    $scope.socket.on('updateView', function (data) {
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


    $scope.voteUp = function(event, index) {
      QueueService.votedSongs[QueueService.queue.songs[index].serviceId] = true;
      QueueService.queue.songs[index].votes++;
      QueueService.rearrangeQueue();
      $scope.socket.emit('voteUp', {
        songs: {songs: QueueService.queue.songs},
        shareId: QueueService.queue.shareId
      });
    };



    /*
    ========== clone ==========
    When on share view, clicking clone button will make a new instance of this queue
    and give this user control. To do this, the queue must be reset

    params:
      -none
    return:
      -none

    */
    $scope.clone = function() {
      var shareLink = $location.host() + 'q/' + QueueService.queue.shareId;
      $('.twitter-share-button').attr({
        'data-url': shareLink,
        'data-text': "Hey, checkout this playlist I made!\n"
      }); //dynamically set the url

      //have to reset queue, or else server error
      var oldQueue = QueueService.queue;
      QueueService.queue = {
        currentSong: oldQueue.currentSong,
        listenId: null,
        shareId: null,
        songs: oldQueue.songs
      };
      //same process as share queue from this point on
      $('#shareRequestModal').addClass('md-show');
    };

    $scope.refresh();
  });