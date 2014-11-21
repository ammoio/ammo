(function() {
  'use strict';

  angular
    .module('ammo.song.directive', [])
    .directive('song', songDirective);

  function songDirective(event) {
    return {
      restrict: 'E',
      scope: {
        model: '='
      },
      templateUrl: 'javascript/_common/directives/song/song.tpl.html',
      link: songDirectiveLink
    };

    function songDirectiveLink(scope) {
      scope.playSong = playSong;

      function playSong() {
        event.publish('play', scope.model);
      }
    }
  }

})();

