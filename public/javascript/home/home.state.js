(function() {
  'use strict';

  angular
    .module('ammo.home.state', [
      'ui.router',
      'ammo.templates',
      'ammo.home.controller'
    ])
    .config(homeState);

  function homeState($stateProvider) {
    $stateProvider
      .state('ammo.player.home', {
        url: '/',
        views:{
          'main@': {
            templateUrl: 'home/home.tpl.html',
            controller: 'HomeController as HomeController'
          }
        }
      });
  }
})();
