(function() {
  'use strict';

  angular
    .module('ammo.providers.service', [
      'ammo.youtube.service'
    ])
    .factory('providers', providersService);

    function providersService($log, youtube) {
      var providers,
          service;

      providers = {
        youtube: youtube
      };

      service = {
        get: get
      };

      return service;

      ////////////
      /**
       * @name get
       * @param {String} providerName name of the provider to return
       */
      function get(providerName) {
        if (!providers[providerName]) {
          $log.error('Unknown provider ' + JSON.stringify(providerName))
        }
        return providers[providerName];
      }
    }
})();
