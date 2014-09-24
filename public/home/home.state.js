(function() {
  'use strict';

  angular
    .module('ammo.states.home', [
      'ui.router',
      'ammo.templates',
      'ammo.controllers.home'
    ])
    .config(homeState);

  function homeState($stateProvider) {
    $stateProvider
      .state('ammo.player.home', {
        url: '',
        views:{
          'main@': {
            templateUrl: 'home/home.tpl.html',
            controller: 'HomeController as HomeController'
          }
        }
      });
  }
})();
