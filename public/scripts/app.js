angular.module('ammoApp', ['ngRoute', 'ui.bootstrap'])

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