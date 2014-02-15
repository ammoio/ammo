angular.module('ammoApp', ['ngRoute', 'ui.bootstrap'])

  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider

      .when('/', {
        templateUrl: '/views/queue.html',
        controller: 'QueueController'
      })
      // display search results in the search view
      .when('/search', {
        templateUrl: '/views/search.html',
        controller: 'SearchController'
      });
  });