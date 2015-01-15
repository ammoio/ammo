(function() {
  'use strict';

  angular
    .module('ammo.app.state', [
      'ui.router',
      'ammo.templates',
      'ammo.header.controller'
    ])
    .config(ammoState);

  function ammoState($stateProvider) {
    $stateProvider
      .state('ammo', {
        abstract: true,
        views: {
          'header@': {
            templateUrl: 'header/header.tpl.html',
            controller: 'HeaderController as headerController'
          }
        }
      });
  }
})();
