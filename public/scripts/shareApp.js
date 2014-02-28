angular.module('ammoApp', ['ngRoute', 'ngCookies'])

  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/q/:id', {
        templateUrl: '/views/share.html',
        controller: 'ShareController'
      })
      .when('/search', {
        templateUrl: '/views/shareSearch.html',
        controller: 'SearchController'
      })
      .when('/', {
        templateUrl: '/index.html',
        controller: function($window){
          $window.location.href = 'http://ammo.io/listen';
        }
      })
      .otherwise({
          redirectTo: '/'
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