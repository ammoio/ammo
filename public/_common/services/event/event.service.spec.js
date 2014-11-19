(function() {
  'use strict';

  describe('event service', function () {
    var eventName = 'test',
        args = ['hello','world'],
        callBack = function () {},
        eventService,
        $rootScope;

    beforeEach(function () {
      module('ammo.event.service');

      inject(function($injector) {
        eventService = $injector.get('event');
        $rootScope = $injector.get('$rootScope');
      });
    });

    describe('publish method', function () {
      it('should $broadcast with arguments if there are subscribers to the event', function () {
        spyOn($rootScope, '$broadcast');
        $rootScope.$on(eventName, callBack);

        eventService.publish(eventName, args[0], args[1]);
        expect($rootScope.$broadcast).toHaveBeenCalledWith(eventName, args[0], args[1]);
      });

      it('should not $broadcast whent there are no subscribers to the event', function () {
        spyOn($rootScope, '$broadcast');

        eventService.publish(eventName, args[0], args[1]);
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
      });
    });

    describe('subscribe method', function () {
      it('should call $rootScope.$on', function () {
        spyOn($rootScope, '$on');

        eventService.subscribe(eventName, callBack);

        expect($rootScope.$on).toHaveBeenCalled();
      });
    });


    describe('should remove the listener', function () {
      it('should remove the callback function', function () {
        var handle = eventService.subscribe(eventName, callBack);
        eventService.unsubscribe(handle);

        expect($rootScope.$$listeners[eventName]).toEqual([null]);
      });
    });
  });
})();
