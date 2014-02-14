angular.module('ammoApp')
  .controller('SearchController', function($scope, SearchService) {
    //set searchResults on scope to reflect change in view
    $scope.searchResults = SearchService.searchResults;

    $scope.addToQueue = function() {

    };
  });