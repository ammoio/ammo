angular.module('ammoApp')
  
  .controller('MainController', function($scope) {
    // $scope.welcome = "ammo";
    $scope.songs = [];

    $scope.add = function(userInput) {
      $scope.songs.push({name: userInput});
    };
  });