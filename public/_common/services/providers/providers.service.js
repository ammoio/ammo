(function() {
  'use strict';

  angular
    .module('ammo.services.providers', [
      'ammo.services.providers.youtube'
    ])
    .factory('providersService', providersService);

    function providersService($log, youtubeService) {
      var providers = {
            youtube: youtubeService
          },
          service;

      service = {
        get: get
      };

      return service;

      ////////////
      function get(providerName) {
        if (!providers[providerName]) {
          $log.error('Unknown provider ' + JSON.stringify(providerName))
        }
        return providers[providerName];
      };
    }
})();
