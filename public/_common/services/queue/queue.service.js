(function() {
  'use strict';

  angular
    .module('ammo.services.queue', [])
    .factory('queueService', queueService);

  function queueService() {
    var queue = [],
        service;

    service = {
      hasSongs: hasSongs,
      nextSong: nextSong
    };

    return service;

    ////////////
    /**
     * @name hasSongs
     * @return {Boolean}
     */
    function hasSongs() {
      return queue.length > 0
    }

    /**
     * @name nextSong
     */
    function nextSong() {
      return queue.shift();
    }
  }
})();
