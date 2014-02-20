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
  .controller('SearchController', function($scope, $location, SearchService, QueueService) {
    //set searchResults on scope to reflect change in view
    $scope.SearchService = SearchService;
    $scope.searchResults = SearchService.searchResults;
    $scope.$watch("SearchService.searchResults", function( newValue, oldValue ) {
        $scope.searchResults = SearchService.searchResults;
      }
    );

    /*
      ========== addToQueue ==========
      Enqueue song and change path to home to switch controller.
      Called when addToQueue clicked in search.html

      Params: 
        param1: song (object)
          - a single song object

      Return: No return
    */
    $scope.addToQueue = function($event, song) {
      $event.stopPropagation();
      QueueService.enqueue(song).then(function(song){
        if (QueueService.queue.shareId) {
          $scope.socket.emit('addSong', {
            shareId: QueueService.queue.shareId
          });
        }
      });
    };

    /*
      ========== returnToQueue ==========
      Return to the queue controller and view

      Params: 
        -none

      Return: No return
    */
    $scope.returnToQueue = function() {
      $location.path('/');      
    };
  });