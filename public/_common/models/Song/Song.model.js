(function() {
  'use strict';

  angular
    .module('ammo.Song.model', ['restangular'])
    .factory('Song', songModel);

  function songModel(Restangular, providers) {
    var model = Restangular.service('songs');

    return model;
  }
})();
