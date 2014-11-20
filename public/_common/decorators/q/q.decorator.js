(function() {
  'use strict';

  angular
    .module('ammo.q.decorator', [])

    .config(decoratorConfig);

  function decoratorConfig($provide) {
    $provide.decorator('$q', function qDecorator($delegate) {
      var $q = $delegate;

      $q.allSettled = allSettled;

      return $q;

      ///////////
      function allSettled(promises) {
        return $q.all(promises.map(function(promise) {
          return promise
            .then(function resolvedPromise(value) {
              return {
                state: 'fulfilled',
                value: value
              };
            })
            .catch(function rejectedPromise(reason) {
              return {
                state: 'rejected',
                reason: reason
              };
            });
        }));
      }
    });
  }

})();

