(function() {
  'use strict';

  angular
    .module('ammo.states.player', [
      'ui.router',
      'ammo.templates',
      'ammo.controllers.player',
      'ammo.controllers.sidebar'
    ])
    .config(playerState);

  function playerState($stateProvider) {
    $stateProvider
      .state('ammo.player', {
        abstract: true,
        views: {
          'sidebar@': {
            templateUrl: 'sidebar/sidebar.tpl.html',
            controller: 'SidebarController as SidebarController'
          },
          'player@': {
            templateUrl: 'player/player.tpl.html',
            controller: 'PlayerController as PlayerController'
          }
        }
      });
  }
})();
