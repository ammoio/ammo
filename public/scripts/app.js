angular.module('ammoApp', ['ngRoute'])

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
      })
      .otherwise({
        templateUrl: '/views/share.html',
        controller: 'ShareController'
      });
  });