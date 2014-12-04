(function() {
  'use strict';

  angular
    .module('ammo.player.service', [
      'ammo.playerSetting.service',
      'ammo.currentPlaylist.service',
      'ammo.queue.service',
      'ammo.Timer.service'
    ])
    .factory('player', playerService);

    function playerService(event, providers, Timer, currentPlaylist, queue, playerSetting) {
      var timer = new Timer(),
          service,
          currentSong;

      service = {
        play: play,
        pause: pause,
        unpause: unpause,
        nextSong: nextSong,
        toggleShuffle: toggleShuffle
      };

      init();

      return service;

      ////////////
      function init() {
        // actions
        event.subscribe('play', play);
        event.subscribe('pause', pause);
        event.subscribe('unpause', unpause);
        event.subscribe('shuffle', toggleShuffle);

        // reactions
        event.subscribe('playing', startTimer);
        event.subscribe('paused', stopTimer);
        event.subscribe('buffering', stopTimer);
        event.subscribe('ended', ended)
      }

      // actions
      function play(song) {
        if (!song) {
          return;
        }

        if (currentSong) {
          providers.get(currentSong.service).pause();
        }
        currentSong = song;

        providers.get(currentSong.service).play(currentSong);
        timer.reset();
      }

      function pause() {
        providers.get(currentSong.service).pause();
      }

      function unpause() {
        providers.get(currentSong.service).unpause();
      }

      function nextSong() {
        if (queue.hasSongs()) {
          service.play(queue.nextSong());
        }
        service.play(currentPlaylist.nextSong());
      }

      function toggleShuffle() {
        playerSetting.toggleShuffle();
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
