(function() {
  'use strict';

  angular
    .module('ammo.player.state', [
      'ui.router',
      'ammo.templates',
      'ammo.player.controller',
      'ammo.sidebar.controller'
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
