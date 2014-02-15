angular.module('ammoApp', ['ngRoute'])

  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider

      .when('/', {
        redirectTo: '/listen'
      })
      // display search results in the search view
      .when('/search', {
        templateUrl: '/views/search.html',
        controller: 'SearchController'
      })
      .when('/listen', {
        templateUrl: '/views/queue.html',
        controller: 'QueueController'
      })
      .when('/listen/:id', {
        templateUrl: '/views/queue.html',
        controller: 'QueueController'
      })
      .when('/:id', {
        templateUrl: '/views/share.html',
        controller: 'ShareController'
      })
      .otherwise({
        templateUrl: '/views/share.html',
        controller: 'ShareController'
      });
  });