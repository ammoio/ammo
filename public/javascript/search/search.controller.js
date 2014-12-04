(function() {
  'use strict';

  angular
    .module('ammo.search.controller', [
      'ammo.providers.service'
    ])

    .controller('SearchController', SearchController);

  function SearchController(providers) {
    var ctrl = this;

    ctrl.results = [];

    ctrl.search = function(query) {
      providers.search(query)
        .then(function(data) {
          console.log(data);
          ctrl.results = data;
        });
    }
  }
})();
