(function() {
  'use strict';

  angular
    .module('ammo', [

      //Abstract States
      'ammo.states.ammo',
      'ammo.states.player',

      //App states
      'ammo.states.home',

      //Services
      'ammo.services.currentPlaylist',
      'ammo.services.event',
      'ammo.services.playlist',
      'ammo.services.providers',
      'ammo.services.queue'
    ]);
})();
