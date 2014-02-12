angular.module('ammoApp')
  
  .controller('MainController', function($scope) {
    // $scope.welcome = "ammo";

    $scope.search = function(userInput) {
      $scope.results = userInput;
    };
  });