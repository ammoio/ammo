(function() {
  'use strict';

  angular
    .module('ammo.services.providers.youtube', [
      'ammo.services.providers.youtube.player',
      'ammo.services.providers.youtube.search'
    ])
    .factory('youtubeService', youtubeService);

  /**
   * This service acts like a wrapper or the 'parent' of both youtubePlayerService and youtubeSearchService
   * so whoever needs the youtube provider will just use youtubeService
   */
    function youtubeService(youtubePlayerService, youtubeSearchService) {
      var service = {
          mute: youtubePlayerService.mute,
          pause: youtubePlayerService.pause,
          play: youtubePlayerService.play,
          search: youtubeSearchService.search,
          seekTo: youtubePlayerService.seekTo,
          setVolume: youtubePlayerService.setVolume,
          stop: youtubePlayerService.stop,
          unMute: youtubePlayerService.unMute,
          unPause: youtubePlayerService.unPause
      };
      return service;
    }
})();
