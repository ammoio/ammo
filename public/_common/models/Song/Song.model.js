(function() {
  'use strict';

  angular
    .module('ammo.Song.model', ['restangular'])
    .factory('Song', songModel);

  function songModel(Restangular, providers) {
    var model = Restangular.service('songs'),
        methods = {
          play: play
        };

    Restangular.extendModel('songs', function(obj) {
      return angular.extend(obj, methods);
    });

    return angular.extend(model, methods);

    ////////////
    function play(song) {
      song = song || this;

      event.publish('play', song);
    }
  }
})();
