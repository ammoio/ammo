(function() {
  'use strict';

  angular
    .module('ammo.soundcloud.player.service', [
      'ammo.constants.service',
      'ammo.event.service'
    ])
    .factory('soundcloudPlayer', soundcloudPlayerService);

  function soundcloudPlayerService($q, $timeout, constants, event) {
    var playerLoaded = false,
        service,
        soundcloud;

    service = {
      mute: mute,
      pause: pause,
      play: play,
      resume: resume,
      seekTo: seekTo,
      setVolume: setVolume,
      unmute: unmute
    };

    return service;

    ////////////
    /**
     * Loads a song to the soundcloud player and then plays it
     * @params {object} song Song to play
     **/
    function play(song) {
      loadPlayer()
        .then(function successLoadPlayer() {
          return setStream(song);
        })
        .then(function successSetStream(scObject) {
          soundcloud = scObject;
          soundcloud.play();
        })
        .catch(function errorLoadPlayer() {
          event.publish('error', 'Failed to load soundcloud Player');
        });
    }

    function pause() {
      soundcloud.pause();
    }

    function resume() {
      soundcloud.resume();
    }

    function mute() {
      soundcloud.mute();
    }

    function unmute() {
      soundcloud.unmute();
    }

    function seekTo(second) {
      soundcloud.setPosition(second * 1000);
    }

    function setVolume(value) {
      soundcloud.setVolume(value);
    }


    ///////
    function setStream(song) {
      var deferred = $q.defer(),
          newEvent = { service: 'soundcloud' };

      SC.stream('/tracks/' + song.serviceId, {
        onfinish: function() {
          event.publish('ended', newEvent);
        },
        onplay: function() {
          event.publish('playing', newEvent);
        },
        onresume: function() {
          event.publish('playing', newEvent);
        },
        onpause: function() {
          event.publish('paused', newEvent);
        },
        onbufferchange: function() {
          if (this.isBuffering) {
            event.publish('buffering', newEvent);
          } else {
            event.publish('playing', newEvent);
          }
        }
      }, function(scObject) {
        deferred.resolve(scObject);
      });

      return deferred.promise;
    }

    /**
     * Loads the soundcloud iframe API asynchronously
     * @returns {promise} Used for knowing when the soundcloud player is ready or failed to load.
     */
    function loadPlayer() {
      var rejectTimer = setRejectTimer(),
          deferred = $q.defer(),
          soundcloudScript;

      if (playerLoaded) {
        return $q.when();
      }

      soundcloudScript = document.createElement('script');
      soundcloudScript.src = '//connect.soundcloud.com/sdk.js';
      document.body.appendChild(soundcloudScript);

      soundcloudScript.onload = function() {
        $timeout.cancel(rejectTimer);

        SC.initialize({
          client_id: constants.soundcloudClientId
        });
        playerLoaded = true;

        deferred.resolve();
      };

      return deferred.promise;

      ///////////
      /**
       * Sets a timer to reject the promise if the soundcloud api is taking too long
       * @returns {$timeout}
       */
      function setRejectTimer() {
        return $timeout(function() {
          deferred.reject();
        }, 7000);
      }
    }
  }
}());
