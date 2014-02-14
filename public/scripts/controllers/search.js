angular.module('ammoApp')
  .controller('SearchController', function($scope, $location, SearchService, QueueService) {
    //set searchResults on scope to reflect change in view
    $scope.searchResults = SearchService.searchResults;

    $scope.addToQueue = function(song) {
      QueueService.enqueue(song);
      $location.path('/');      
    };
  });