angular.module('ammoApp', ['ngRoute', 'ngProgress', 'ngCookies', 'ui.sortable'])

  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider

      .when('/', {
        redirectTo: '/listen'
      })
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
      .when('/playlist/:id', {
        templateUrl: '/views/playlist.html',
        controller: 'PlaylistController'
      })
      .otherwise({
        redirectTo: '/listen'
      });

    OAuth.initialize('YTaWoCjSvB9X8LcCyc8hn6sp798');

  })

  .run(function ($rootScope, $location) {
    var history = [];

    $rootScope.$on('$routeChangeSuccess', function() {
      history.push($location.$$path);
    });

    $rootScope.back = function () {
      var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
      $location.path(prevUrl);
    };
  });