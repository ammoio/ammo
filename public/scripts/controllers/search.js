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
      $location.path('/');      
    };
  });