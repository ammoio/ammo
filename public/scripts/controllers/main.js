angular.module('ammoApp')
  
  .controller('MainController', function($scope, $http, ParseService) {
    // $scope.welcome = "ammo";
    $scope.songs = [];
    $scope.showing = true;
    $scope.searchResults = [];

    $scope.add = function(userInput) {
      $scope.songs.push({name: userInput});
      $scope.showing = !$scope.showing;

      $http({ method: 'GET', url: 'https://gdata.youtube.com/feeds/api/videos?q=' + userInput + '&orderby=relevance&max-results=5&alt=json&v=2' })
        .then(function(results) {
          console.log(results);
          results.data.feed.entry.forEach(function(video) { 
            $scope.searchResults.push({
              title: video.title.$t,
              service: "youtube",
              service_id: ParseService.youtube(video.link[0].href)
            });
          });
        });
    };    
  });