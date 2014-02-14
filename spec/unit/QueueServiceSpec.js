describe('QueueService', function() {
    var $scope, $location, $rootScope, $service;

    beforeEach(module('ammoApp'));
    beforeEach(inject(function($injector) {
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();

        $service = $injector.get('QueueService');

    }));

    it('should have a methods to enqueue and dequeue', function() {
        expect($service.enqueue).toBeDefined();
        expect($service.dequeue).toBeDefined();
    });
});