angular.module('ammoApp')
  
  .controller('MainController', function($scope) {
    // $scope.welcome = "ammo";
    $scope.songs = [];
    $scope.showing = true;

    $scope.share = function() {
      console.log('sharing');
    };

    $scope.add = function(userInput) {
      /************** query sound cloud *************/
      //SC is initialized in app.js
      //q: query string
      //limit: number of results to return
      SC.get('/tracks', { q: userInput, limit: 3 }, function(tracks) {
        tracks.forEach(function(track){
          console.log(track);
          $scope.$apply(function() {
            $scope.songs.push({name: track.title, id: track.id});
          });
        });
      });
      // $scope.showing = !$scope.showing;
    };
  });