(function() {
  'use strict';

  angular
    .module('ammo.Song.model', ['restangular'])
    .factory('Song', songModel);

  function songModel(Restangular) {
    var service = Restangular.service('songs');

    return service;

    ////////////
    /**
     * @return {boolean}
     */
    function hasSongs() {
      return false
    }
  }
})();
