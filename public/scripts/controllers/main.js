angular.module('ammoApp')
  
  .controller('MainController', function($scope, $http) {
    // $scope.welcome = "ammo";
    $scope.songs = [];
    $scope.showing = true;

    /* Share Button: when clicked, share button do a post request to /queues */
    $scope.share = function() {
      $http({method: 'POST', url: '/queues'}).
      success(function(data, status, headers, config) {

      })
      .error(function(){
        console.log('post error');
      });
    };


    $scope.add = function(userInput) {
    /************** query sound cloud *************/

      //limit: number of results to return
      var limit = 3;

      //clientId for soundcloud api authorization
      var clientId = "456165005356d6638c4eabfc515d11aa";

      //searchUrl: get request url for query
      //"q" is the search query
      var searchUrl = "http://api.soundcloud.com/tracks?";
      searchUrl = searchUrl + "q=" + userInput + "&limit=" + limit + "&client_id=" + clientId + "&format=json";

      //GET request
      $http({method: 'GET', url: searchUrl }).
      success(function(data, status, headers, config) {
        //add each returned track title to each list
        data.forEach(function(track) {
          $scope.songs.push({ name: track.title, id: track.id });
        });
      }).
      error(function(data, status, headers, config) {
        console.log('failed query');
      });

      $scope.showing = !$scope.showing;
    };
  });