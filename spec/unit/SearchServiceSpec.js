describe('SearchService', function() {
    var $scope, $location, $rootScope, $service;

    beforeEach(module('ammoApp'));
    beforeEach(inject(function($injector) {
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();

        $service = $injector.get('SearchService');

    }));

    it('should have a searchResults variable', function() {
        expect($service.searchResults).toEqual([]);
    });

    xit('should add search results to the array after querying youtube', function() {
        var before = $service.searchResults.length;
        $service.youtube("Back in Black");

        //console.log($service.searchResults);
        //expect(before).toBeLessThan($service.searchResults.length);
    });
});