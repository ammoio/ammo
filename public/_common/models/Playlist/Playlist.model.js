(function() {
  'use strict';

  angular
    .module('ammo.Playlist.model', ['restangular'])
    .factory('Playlist', playlistModel);

  function playlistModel(Restangular) {
    var model = Restangular.service('playlists');

    return model;
  }
})();
