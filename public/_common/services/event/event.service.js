(function() {
  'use strict';

  angular
    .module('ammo.event.service', [])
    .factory('event', eventService);

    function eventService($rootScope) {
      var service = {
        publish: publish,
        subscribe: subscribe,
        unsubscribe: unsubscribe
      };

      return service;

      ////////////
      /**
       * @param {string} event to publish
       * @param {*} args Data to be passed to all listeners of the event
       */
      function publish(event, args) {
        //there are no listeners
        if (!$rootScope.$$listeners[event]) {
          return;
        }

        //send the event
        args = Array.prototype.slice.call(arguments, 1);
        $rootScope.$broadcast.apply($rootScope, [event].concat(args));
      }

      /**
       * @param {string} event to subscribe to
       * @param {function} callback to be called when an event is published
       * @return {function}
       */
      function subscribe(event, callback) {
        return $rootScope.$on(event, function eventCallback(event, args) {
          callback.apply(null, Array.prototype.slice.call(arguments, 1));
        });
      }

      /**
       * This function takes the result of the subscribe to this method
       * in order to unsubscribe from the event. Alternatively, the function returned
       * from subscribe can be invoked directly to unsubscribe.
       * @param {function} handle function returned from the subscribe method
       */
      function unsubscribe(handle) {
        if (angular.isFunction(handle)) {
          handle();
        }
      }
    }
})();
