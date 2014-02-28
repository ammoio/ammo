angular.module('ammoApp')

  /*
  ========== SearchController ==========
  This controller is subordinate to FrameController. This is set as the controller when the url is /search
  variables:
    searchResults: array of search results from api queries

  methods:
    addToQueue:
      when addToQueue button clicked. Add this song to queue
    returnToQueue:
      when returnToQueue button clicked, change url to home
  */
  .controller('SearchController', function ($http, $scope, $location, SearchService, QueueService, UserService) {
    //set searchResults on scope to reflect change in view
    $scope.UserService = UserService;
    $scope.SearchService = SearchService;
    $scope.searchResults = SearchService.searchResults;
    $scope.$watch("SearchService.searchResults", function () {
      $scope.searchResults = SearchService.searchResults;
    });

    /*
      ========== addToQueue ==========
      Enqueue song and change path to home to switch controller.
      Called when addToQueue clicked in search.html

      Params:
        param1: song (object)
          - a single song object

      Return: No return
    */
    $scope.addToQueue = function ($event, song) {
      QueueService.enqueue(song)
        .then(function () {
          if (QueueService.queue.shareId) {
            $scope.socket.emit('queueChanged', {
              shareId: QueueService.queue.shareId
            });
          }
        });
    };

    $scope.addToQueueBack = function ($event, song) {
      $event.stopPropagation();
      QueueService.live = true;
      QueueService.enqueue(song)
        .then(function () {
          if (QueueService.queue.shareId) {
            $scope.socket.emit('queueChanged', {
              shareId: QueueService.queue.shareId
            });
          }
          $scope.back();
        });
    };


    /*
      ========== addTo ==========
      Adds a song to either the queue or a specific

      Params:
        destination:
          - 'queue' for the queue or a playlist object

        song:
          - a single song object

        event:
          - Event triggered with the ng-click so we can stop propagation
    */
    $scope.addTo = function (destination, song, $event) {
      $event.preventDefault();

      if (destination === 'queue') {
        $scope.addToQueue(event, song);
      } else {
        $http({ method: 'POST', url: '/queues/' + destination.shareId + '/add', data: song });
      }
    };

    /*
      ========== returnToQueue ==========
      Return to the queue controller and view

      Params:
        -none

      Return: No return
    */
    $scope.returnToQueue = function () {
      $location.path('/');
    };
  });