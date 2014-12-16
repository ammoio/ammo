(function() {
  'use strict';

  angular
    .module('ammo.currentPlaylist.service', [
      'ammo.playerSettings.service',
      'ammo.event.service'
    ])
    .factory('currentPlaylist', currentPlaylistService);

  function currentPlaylistService(event, playerSettings) {
    var currentPlaylist,
        nextIndex,
        service,
        shuffledPlaylist,
        unshuffledPlaylist;

    service = {
      setPlaylist: setPlaylist,
      nextSong: nextSong,
      shuffle: shuffle
    };

    return service;

    ////////////

    function init() {
      event.subscribe('shuffle', shuffle);
    }

    /**
     * @param {object} playlist actual playlist object retrieved from the server
     * @param {number} index of the current song to set as currentIndex
     */
    function setPlaylist(playlist, index) {
      currentPlaylist = unshuffledPlaylist = playlist;
      nextIndex = index || 0;

      if (playerSettings.getShuffled()) {
        service.shuffle(true);
      }
      return currentPlaylist;
    }

    /**
     * @return {object} next song in the playlist
     */
    function nextSong() {
      var nextSong;

      if (!currentPlaylist || nextIndex > currentPlaylist.length - 1) {
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

    function setShuffle() {
      shuffledPlaylist = _.clone(unshuffledPlaylist, true);
      shuffledPlaylist.songs = _.shuffle(shuffledPlaylist.songs);
      moveCurrentSongToFirst();

      currentPlaylist = shuffledPlaylist;
      nextIndex = 0;

      return currentPlaylist;
    }

    /**
     * @param {boolean} doShuffle: if true shuffle, else unshuffle playlist
     */
    function shuffle(doShuffle) {
      if (doShuffle) {
        setShuffle();
      } else {
        unsetShuffle();
      }
    }

    function unsetShuffle() {
      currentPlaylist = unshuffledPlaylist;
      return currentPlaylist;
    }

    function moveCurrentSongToFirst() {
      var currentSongs  = currentPlaylist.songs,
          shuffledSongs = shuffledPlaylist.songs,
          currentSongIndex = nextIndex === 0 ? nextIndex : nextIndex - 1,
          currentShuffledSongIndex = _.indexOf(shuffledSongs, currentSongs[currentSongIndex]);

      shuffledSongs.unshift(shuffledSongs.splice(currentShuffledSongIndex, 1)[0]);
    }
  }
})();
