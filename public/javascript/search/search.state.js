(function() {
  'use strict';

  angular
    .module('ammo.search.state', [
      'ui.router',
      'ammo.templates',
      'ammo.search.controller'
    ])
    .config(searchState);

  function searchState($stateProvider) {
    $stateProvider
      .state('ammo.player.search', {
        url: '/search',
        views:{
          'main@': {
            templateUrl: 'javascript/search/search.tpl.html',
            controller: 'SearchController as searchController'
          }
        }
      });
  }
})();
