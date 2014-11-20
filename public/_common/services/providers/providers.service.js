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
            promises = [],
            results = [];

        _.each(providers, function iterateProviders(provider) {
          promises.push(provider.search(query));
        });

        $q.allSettled(promises)
          .then(function allSettledResolve(data) {
            _.each(data, function iteratePromises(promise) {
              if (promise.state === 'fulfilled') {
                results = results.concat(promise.value);
              }
            });
            deferred.resolve(results);
          });

        return deferred.promise;
      }
    }
})();

