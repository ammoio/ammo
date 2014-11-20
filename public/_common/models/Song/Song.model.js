(function() {
  'use strict';

  angular
    .module('ammo.Song.model', ['restangular'])
    .factory('Song', songModel);

  function songModel(Restangular, providers) {
    var model = Restangular.service('songs');

    Restangular.extendModel('songs', function(obj) {
      return angular.extend(obj, {
        play: play
      });
    });

    return model;

    ////////////
    /**
     * @return {boolean}
     */
    function play(song) {
      song = song || this;
      console.log('Playing: ', song.title);
    }
  }
})();
