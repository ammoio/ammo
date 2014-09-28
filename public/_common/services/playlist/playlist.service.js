(function() {
  'use strict';

  angular
    .module('ammo.services.playlist', [
      'ammo.services.event'
    ])
    .factory('playlistService', playlistService);

  function playlistService(eventService) {
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

      eventService.publish('songAdded', {
        playlistId: playlistId,
        song: song
      });
    }
  }
})();
