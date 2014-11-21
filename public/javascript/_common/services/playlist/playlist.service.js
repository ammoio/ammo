(function() {
  'use strict';

  angular
    .module('ammo.playlist.service', [
      'ammo.event.service'
    ])
    .factory('playlist', playlistService);

  function playlistService(event) {
    var service;

    service = {
      addSong: addSong
    };

    return service;

    ////////////
    /**
     * @param {number} playlistId of the playlist to add the song
     * @param {object} song to add
     */
    function addSong(playlistId, song) {

      //TODO: Perform $http request to update playlist

      event.publish('songAdded', {
        playlistId: playlistId,
        song: song
      });
    }
  }
})();
