angular.module('ammoApp')
  .controller('SearchController', function($scope, $location, SearchService, QueueService) {
    //set searchResults on scope to reflect change in view
    $scope.searchResults = SearchService.searchResults;
    
    /*
      ========== addToQueue ==========
      Enqueue song and change path to home to switch controller.
      Called when addToQueue clicked in search.html

      Params: 
        param1: song (object)
          - a single song object

      Return: No return
    */
    $scope.addToQueue = function(song) {
      QueueService.enqueue(song);
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