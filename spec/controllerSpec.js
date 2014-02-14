describe('FrameController', function(){
  var scope;
  beforeEach(angular.mock.module('ammoApp'));
  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    $controller('FrameController', {$scope:scope});
  }));

  it('should create a scope variable called songs that is an array', function(){
      expect(Array.isArray(scope.songs)).toBe(true);
  });

});