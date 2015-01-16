(function() {
  'use strict';

  angular
    .module('ammo.youtube.service', [
      'ammo.youtube.player.service',
      'ammo.youtube.search.service'
    ])
    .factory('youtube', youtubeService);

  /**
   * This service acts like a wrapper or the 'parent' of both youtubePlayer and youtubeSearch
   * so whoever needs the youtube provider will just use youtubeService
   */
  function youtubeService(youtubePlayer, youtubeSearch) {
    return {
      mute: youtubePlayer.mute,
      pause: youtubePlayer.pause,
      play: youtubePlayer.play,
      resume: youtubePlayer.resume,
      search: youtubeSearch.search,
      seekTo: youtubePlayer.seekTo,
      setVolume: youtubePlayer.setVolume,
      stop: youtubePlayer.stop,
      unmute: youtubePlayer.unmute
    };
  }
}());
