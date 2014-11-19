(function() {
  'use strict';

  angular
    .module('ammo.providers.service', [
      'ammo.youtube.service'
    ])
    .factory('providers', providersService);

    function providersService($log, $q, youtube) {
      var providers,
          service;

      providers = {
        youtube: youtube
      };

      service = {
        get: get,
        search: search
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

      /**
       * Calls provider.search on each of the providers
       * @param {string} query Search Query
       * @returns {promise}
       */
      function search(query) {
        var deferred = $q.defer(),
            promises = [];

        _.each(providers, function(provider) {
          promises.push(provider.search(query));
        });

        $q.all(promises)
          .then(function(data) {
            deferred.resolve(_.flatten(data, true));
          });

        return deferred.promise;
      }
    }
})();
