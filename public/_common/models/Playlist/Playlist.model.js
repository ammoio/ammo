(function() {
  'use strict';

  angular
    .module('ammo.Playlist.model', ['restangular'])
    .factory('Playlist', playlistModel);

  function playlistModel(Restangular) {
    var service = Restangular.service('playlists');

    return service;
  }
})();