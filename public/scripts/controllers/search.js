angular.module('ammoApp')
  .controller('SearchController', function($scope, SearchService) {
    $scope.searchResults = SearchService.searchResults;
  });