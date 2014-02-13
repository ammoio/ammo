angular.module('ammoApp', ['ngRoute'])

  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider

      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainController'
      });
  });

  // /* sound cloud initialization
  SC.initialize({
    client_id: '456165005356d6638c4eabfc515d11aa'
  });