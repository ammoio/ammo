(function() {
  'use strict';

  angular
    .module('ammo.Timer.service', [])
    .factory('Timer', timerService);

    function timerService() {

      function Timer() {
        this.startTime = 0;
        this.stopTime = 0;
        this.totalElapsed = 0;
        this.running = false;
      }

      Timer.prototype = {
        start: startTimer,
        stop: stopTimer,
        reset: reset,
        getElapsed: getElapsed
      };

      return Timer;

      ////////////
      function reset() {
        this.totalElapsed = 0;
        this.startTime = 0;
        this.stopTime = 0;
        this.running = false;
      }

      function startTimer() {
        if (!this.running) {
          this.startTime = new Date().getTime();
          this.stopTime = 0;
          this.running = true;
        }
      }

      function stopTimer() {
        var elapsed;

        if(this.running) {
          this.stopTime = new Date().getTime();
          this.running = false;

          elapsed = this.stopTime - this.startTime;
          this.totalElapsed += elapsed;
        }

        return this.getElapsed();
      }

      function getElapsed() {
        var elapsed = 0;
        if(this.running) {
          elapsed = new Date().getTime() - this.startTime;
        }
        elapsed += this.totalElapsed;

        return elapsed / 1000; // return time in seconds
      }
    }
})();
