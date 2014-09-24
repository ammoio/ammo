(function() {
  'use strict';

  angular
    .module('ammo.states.ammo', [
      'ui.router',
      'ammo.templates',
      'ammo.controllers.header'
    ])
    .config(ammoState);

  function ammoState($stateProvider) {
    $stateProvider
      .state('ammo', {
        abstract: true,
        views: {
          'header@': {
            templateUrl: 'header/header.tpl.html',
            controller: 'HeaderController as HeaderController'
          }
        }
      });
  }
})();
