angular.module('ammoApp')
  
  .controller('MainController', function($scope) {
    // $scope.welcome = "ammo";
    $scope.songs = [];
    $scope.showing = true;

    $scope.add = function(userInput) {
      $scope.songs.push({name: userInput});
      $scope.showing = !$scope.showing;
    };
  });