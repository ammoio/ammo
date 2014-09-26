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
      function publish(name, args) {
        //there are no listeners
        if (!$rootScope.$$listeners[name]) {
          return;
        }

        //send the event
        $rootScope.$broadcast(name, args);
      }

      function subscribe(name, callback) {
        return $rootScope.$on(name, callback);
      }

      //Pass in the result of subscribe to this method, or just call the method returned from subscribe to unsubscribe
      function unsubscribe(handle) {
        if (angular.isFunction(handle)) {
          handle();
        }
      }
    }
})();