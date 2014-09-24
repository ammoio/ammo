(function() {
  'use strict';

  angular
    .module('ammo', [

      //Abstract States
      'ammo.states.ammo',
      'ammo.states.player',

      //App states
      'ammo.states.home'
    ]);
})();
