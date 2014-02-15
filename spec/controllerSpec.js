describe('FrameController', function() {
    var $scope, $location, $rootScope, createController;

    beforeEach(module('ammoApp'));
    beforeEach(inject(function($injector) {
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();

        var $controller = $injector.get('$controller');

        createController = function() {
            return $controller('FrameController', {
                '$scope': $scope
            });
        };
    }));

    it('should have a method to check if the path is active', function() {
        $location.path('/about');
        // console.log(window.location);
        var x = createController();
        // console.log($scope);
        expect($scope.share).toBeDefined();
    });
});