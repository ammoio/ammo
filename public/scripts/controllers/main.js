angular.module('ammoApp')
  
  .controller('MainController', function($scope, $http, ParseService, SearchService, QueueService) {
    $scope.songs = [];
    $scope.searchResults = [];


    $scope.add = function(userInput) {
      console.log($scope.searchResults);
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
    };

    /* Share Button: when clicked, share button do a post request to /queues */
    $scope.share = function() {
      Services.saveQueue($scope.searchResults);
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
    SearchService.youtube('hello', pushResults);
    SearchService.soundcloud('hello', pushResults);

    setTimeout(function() {
      console.log($scope.searchResults);
    }, 3000);
  });