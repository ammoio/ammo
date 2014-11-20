(function() {
  'use strict';

  angular
    .module('ammo', [
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
      'ammo.queue.service'
    ]);
})();
