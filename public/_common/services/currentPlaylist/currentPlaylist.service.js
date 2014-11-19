(function() {
  'use strict';

  angular
    .module('ammo.currentPlaylist.service', [])
    .factory('currentPlaylist', currentPlaylistService);

  function currentPlaylistService() {
    var currentPlaylist,
        nextIndex,
        service;

    service = {
      setPlaylist: setPlaylist,
      nextSong: nextSong
    };

    return service;

    ////////////
    /**
     * @param {object} playlist actual playlist object retrieved from the server
     * @param {number} index of the current song to set as currentIndex
     */
    function setPlaylist(playlist, index) {
      currentPlaylist = playlist;
      nextIndex = index || 0;
      return currentPlaylist;
    }

    /**
     * @return {object} next song in the playlist
     */
    function nextSong() {
      var nextSong;

      if (!currentPlaylist || nextIndex > currentPlaylist.songs.length) {
        return null;
      }

      nextSong = getSong(nextIndex);
      nextIndex += 1;

      return nextSong;
    }

    /**
     * @param {number} index of the song in the playlist
     */
    function getSong(index) {
      var songs = currentPlaylist.songs;
      return songs[index];
    }
  }
})();
