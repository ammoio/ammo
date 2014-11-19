(function() {
  'use strict';

  angular
    .module('ammo', [
      
      //App states
      'ammo.app.state',
      'ammo.player.state',
      'ammo.home.state',
      'ammo.search.state',

      //Services
      'ammo.currentPlaylist.service',
      'ammo.event.service',
      'ammo.playlist.service',
      'ammo.providers.service',
      'ammo.queue.service'
    ]);
})();
