(function() {
  'use strict';

  angular
    .module('ammo.player.service', [])
    .factory('player', playerService);

    function playerService(event, providers, Timer) {
      var timer = new Timer(),
          service,
          currentSong;

      service = {
        play: play,
        pause: pause,
        unpause: unpause,
        nextSong: nextSong
      };

      init();

      return service;

      ////////////
      function init() {
        // actions
        event.subscribe('play', play);
        event.subscribe('pause', pause);
        event.subscribe('unpause', unpause);

        // reactions
        event.subscribe('playing', startTimer);
        event.subscribe('paused', stopTimer);
        event.subscribe('buffering', stopTimer);
        event.subscribe('ended', ended)
      }

      // actions
      function play(song) {
        console.log("test", song);
        if (!song) {
          return;
        }
        timer.reset();
        currentSong = song;
        providers.get(currentSong.service).play(currentSong);
      }

      function pause() {
        providers.get(currentSong.service).pause();
      }

      function unpause() {
        providers.get(currentSong.service).unpause();
      }

      function nextSong() {
        service.play(currentPlaylist.nextSong());
      }

      // reactions
      function startTimer() {
        timer.start();
      }

      function stopTimer() {
        timer.stop();
      }

      function ended() {
        service.stopTimer();
        service.nextSong();
      }

    }
})();
