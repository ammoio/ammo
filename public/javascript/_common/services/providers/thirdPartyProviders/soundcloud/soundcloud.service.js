(function() {
  'use strict';

  angular
    .module('ammo.soundcloud.service', [
      'ammo.soundcloud.player.service',
      'ammo.soundcloud.search.service'
    ])
    .factory('soundcloud', soundcloudService);

  /**
   * This service acts like a wrapper or the 'parent' of both soundcloudPlayer and soundcloudSearch
   * so whoever needs the soundcloud provider will just use soundcloudService
   */
  function soundcloudService(soundcloudPlayer, soundcloudSearch) {
    return {
      mute: soundcloudPlayer.mute,
      pause: soundcloudPlayer.pause,
      play: soundcloudPlayer.play,
      resume: soundcloudPlayer.resume,
      search: soundcloudSearch.search,
      seekTo: soundcloudPlayer.seekTo,
      setVolume: soundcloudPlayer.setVolume,
      unmute: soundcloudPlayer.unmute
    };
  }
}());
