angular.module('ammoApp.myDirective', [])
  .directive('ngEscape', function () {
    return function (scope, element, attrs) {
      element.bind("keyup", function (event) {
        if (event.which === 27) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEscape);
          });
          event.preventDefault();
        }
      });
    };
  });