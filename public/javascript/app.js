(function() {
  'use strict';

  angular
    .module('ammo', [
      // 3rd Party
      'satellizer',

      // Config
      'ammo.config',
      
      // App states
      'ammo.app.state',
      'ammo.player.state',
      'ammo.home.state',
      'ammo.search.state',

      // Decorators
      'ammo.q.decorator',

      // Models
      'ammo.Playlist.model',
      'ammo.Song.model',

      // Services
      'ammo.currentPlaylist.service',
      'ammo.event.service',
      'ammo.playlist.service',
      'ammo.providers.service',
      'ammo.queue.service',
      'ammo.player.service',
      'ammo.Timer.service',

      // Directives
      'ammo.song.directive',

      // Third party modules
      'ngMaterial'
    ]);
})();
