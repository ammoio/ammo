angular.module('ammoApp', ['ngRoute'])

  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider

      .when('/', {
        templateUrl: '/views/queue.html',
        controller: 'QueueController'
      });
  });