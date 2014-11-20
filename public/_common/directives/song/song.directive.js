(function() {
  'use strict';

  angular
    .module('ammo.song.directive', [])
    .directive('song', songDirective);

  function songDirective() {
    return {
      restrict: 'E',
      scope: {
        model: '='
      },
      templateUrl: '_common/directives/song/song.tpl.html',
      link: songDirectiveLink
    };

    function songDirectiveLink() {

    }
  }

})();

