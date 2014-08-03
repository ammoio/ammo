angular.module('ammoApp', [
  'ngRoute',
  'ngProgress',
  'ngCookies',
  'ui.sortable',
  'angular-google-analytics',
  'ammoApp.myDirective',
  'ammoApp.frame',
  'ammoApp.player',
  'ammoApp.playlist',
  'ammoApp.queue',
  'ammoApp.search',
  'ammoApp.share',
  'ammoApp.frame',
  'templates'
])

  .config(function ($routeProvider, $locationProvider, AnalyticsProvider) {
    //setup your account
    AnalyticsProvider.setAccount('UA-50145036-1'); // automatic route tracking (default=true)
    AnalyticsProvider.trackPages(true);
    //Optional set domain (Use 'none' for testing on localhost)
    AnalyticsProvider.setDomainName('ammo.io');
    //Use analytics.js instead of ga.js
    AnalyticsProvider.useAnalytics(true);
    // Ignore first page view.
    AnalyticsProvider.ignoreFirstPageLoad(true);


    $locationProvider.html5Mode(true);
    $routeProvider

      .when('/', {
        redirectTo: 'listen'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchController'
      })
      .when('/listen', {
        templateUrl: 'views/queue.html',
        controller: 'QueueController'
      })
      .when('/listen/:id', {
        templateUrl: 'views/queue.html',
        controller: 'QueueController'
      })
      .when('/playlist/:id', {
        templateUrl: 'views/playlist.html',
        controller: 'PlaylistController'
      })
      .otherwise({
        redirectTo: 'listen'
      });

    OAuth.initialize('YTaWoCjSvB9X8LcCyc8hn6sp798');

  })

  .run(function ($rootScope, $location, Analytics) {
    var history = [];

    $rootScope.$on('$routeChangeSuccess', function () {
      history.push($location.$$path);
    });

    $rootScope.back = function () {
      var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
      $location.path(prevUrl);
    };
  });
