(function() {
  'use strict';

  angular
    .module('ammo.services.event', [])
    .factory('eventService', eventService);

    function eventService($rootScope) {
      var service = {
        publish: publish,
        subscribe: subscribe,
        unsubscribe: unsubscribe
      };

      return service;

      ////////////
      /**
       * @name publish
       * @param {String} event to publish
       * @param args Data to be passed to all listeners of the event
       */
      function publish(event, args) {
        //there are no listeners
        if (!$rootScope.$$listeners[event]) {
          return;
        }

        //send the event
        $rootScope.$broadcast(event, args);
      }

      /**
       * @name subscribe
       * @param {String} event to subscribe to
       * @param {Function} callback to be called when an event is published
       * @return {Function}
       */
      function subscribe(event, callback) {
        return $rootScope.$on(event, callback);
      }

      /**
       * @name unsubscribe
       * @desc Pass in the result of subscribe to this method, or just call the method returned from subscribe
       *       in order to unsubscribe from an event
       * @param {Function} handle function returned from the subscribe method
       */
      function unsubscribe(handle) {
        if (angular.isFunction(handle)) {
          handle();
        }
      }
    }
})();
