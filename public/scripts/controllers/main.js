angular.module('ammoApp')
  
  .controller('MainController', function($scope, $http, Services) {
    // $scope.welcome = "ammo";
    $scope.songs = [];
    $scope.searchResults = [];
    $scope.showing = true;


    /************** search sound cloud *************/
    $scope.add = function(userInput) {
      //display on screen
      $scope.songs.push({name: userInput});
      //from services.js. GET request to soundcloud's api to search for songs
      Services.soundcloudSearch(userInput, function(searchResult, song) {
        $scope.searchResults.push(searchResult);
        $scope.songs.push(song);
      });
    };

    /* Share Button: when clicked, share button do a post request to /queues */
    $scope.share = function() {
      Services.saveQueue($scope.searchResults);
    };

    /**********************************************/
      $scope.showing = !$scope.showing;
    });