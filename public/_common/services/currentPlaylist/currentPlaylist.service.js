(function() {
  'use strict';

  angular
    .module('ammo.services.currentPlaylist', [])
    .factory('currentPlaylistService', currentPlaylistService);

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
     * @name setPlaylist
     * @param playlist actual playlist object retrieved from the server
     * @param index of the current song to set as currentIndex
     */
    function setPlaylist(playlist, index) {
      currentPlaylist = playlist;
      nextIndex = index || 0;
      return currentPlaylist;
    }

    /**
     * @name nextSong
     * @return next song in the playlist
     */
    function nextSong() {
      var nextSong;

      if (!currentPlaylist || nextIndex > currentPlaylist.songs.length) {
        return;
      }

      nextSong = getSong(nextIndex);
      nextIndex += 1;

      return nextSong;
    }

    /**
     * @name getSong
     * @param index of the song in the playlist
     */
    function getSong(index) {
      var songs = currentPlaylist.songs;
      return songs[index];
    }
  }
})();
