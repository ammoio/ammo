angular.module('ammoApp')

  .controller('FrameController', function($scope, $http, ParseService, $location, SearchService, QueueService) {
    $scope.songs = [];
    $scope.searchResults = []; //maybe redundant


    $scope.add = function(userInput) {
      $scope.songs.push({name: userInput});
    };


    /* 
      ========== $scope.search ==========
      Gets called when user clicks or hits enter on the search bar/button

      Params: 
        userInput
          - Whathever is currently on the search box (inside form #search)
    */
    $scope.search = function(userInput) {
      // Clearing past search results
      $scope.searchResults = [];
      //Call SearchService for each of the services and pass pushResults as a callback 
      SearchService.youtube(userInput, pushResults);
      SearchService.soundcloud(userInput, pushResults); 
      $location.path('/search');
    };

    /* Share Button: when clicked, share button do a post request to /queues */
    $scope.share = function() {
      QueueService.saveQueue($scope.searchResults);
    };

    /* 
      ========== pushResults ==========
      Gets called as a callback from SearchService to be able to push results
      to $scope.searchResults since they are in different scopes.

      Params: 
        song
          - song object returned by SearchService $http 'GET' request
    */
    var pushResults = function(song) {
      $scope.searchResults.push(song);
    };

  });