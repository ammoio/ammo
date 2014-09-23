(function() {
  'use strict';

  angular
    .module('ammo.controllers.home', [
      'ui.router'
    ])
    .config(HomeConfig)
    .controller('HomeController', HomeController);

  function HomeConfig($stateProvider) {
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

  function HomeController() {
    var Ctrl = this;
  }
})();
