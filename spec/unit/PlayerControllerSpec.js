describe('PlayerController', function() {
    var $scope, $location, $rootScope, QueueService, createController;

    beforeEach(module('ammoApp'));
    beforeEach(inject(function($injector) {
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();

        QueueService = $injector.get('QueueService');
        var $controller = $injector.get('$controller');

        createController = function() {
            return $controller('PlayerController', {
                '$scope': $scope
            });
        };
    }));

    it('should set $scope.playing to true when play is called', function(){
        waitsFor(function(){
            return scPlayer;
        });

        runs(function() {
            youtube = {
                pauseVideo: function(){},
                stopVideo: function(){},
                playVideo: function(){}
            };
            var controller = createController();
            expect($scope.playing).toBe(false);
            $scope.play(0, 's');
            expect($scope.playing).toBe(true);
        });
    });
});