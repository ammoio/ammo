(function() {
  'use strict';

  angular
    .module('ammo.providers.service', [
      'ammo.youtube.service',
      'ammo.soundcloud.service'
    ])
    .factory('providers', providersService);

    function providersService($log, $q, youtube, soundcloud) {
      var providers,
          service;

      providers = {
        youtube: youtube,
        soundcloud: soundcloud
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
          $log.error('Unknown provider ' + JSON.stringify(providerName));
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

        _.each(providers, function iterateProviders(provider) {
          promises.push(provider.search(query));
        });

        $q.allSettled(promises)
          .then(function allSettledResolve(data) {
            deferred.resolve(_.reduce(data, function iteratePromises(acc, promise) {
              if (promise.state === 'fulfilled') {
                return acc.concat(promise.value);
              }
              return acc;
            }, []));
          });

        return deferred.promise;
      }
    }
})();

