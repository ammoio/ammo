(function() {
  'use strict';

  angular
    .module('ammo.services.providers.youtube.player', [])
    .factory('youtubePlayerService', youtubePlayerService);

  function youtubePlayerService($window, $q, $timeout, eventService) {
    var isPlayerLoaded = false,
      service,
      youtube;

    service = {
      mute: mute,
      pause: pause,
      play: play,
      seekTo: seekTo,
      setVolume: setVolume,
      stop: stop,
      unMute: unMute,
      unPause: unPause
    };
    return service;

    ////////////
    /**
     * Loads a song to the youtube player and then plays it
     * @params {object} song Song to play
     **/
    function play(song) {
      loadPlayer()
        .then(function successLoadPlayer() {
          youtube.loadVideoById(song.serviceId, 0, 'large');
          youtube.playVideo();
        }, function errorLoadPlayer() {
          eventService.publish('error', 'Failed to load YouTube Player');
        });
    }

    /**
     * Pause the youtube player
     */
    function pause() {
      youtube.pauseVideo();
    }

    /**
     * Unpause the youtube player, this is different than the play function since we
     * are not loading the song to the player in this function.
     */
    function unPause() {
      youtube.playVideo();
    }

    /**
     * Seek the youtube player to a specific second
     * @param {integer} second The time in seconds to a specific part of the video
     */
    function seekTo(second) {
      youtube.seekTo(second, true);
    }

    /**
     * Stop the youtube player
     */
    function stop() {
      youtube.stopVideo();
    }

    /**
     * Mute the youtube player
     */
    function mute() {
      youtube.mute();
    }

    /**
     * Unmute the youtube player
     */
    function unMute() {
      youtube.unMute();
    }

    /**
     * Change the volume of the youtube player
     * @param {integer} volume A number from 0 to 100 to set the volume to
     */
    function setVolume(volume) {
      youtube.setVolume(volume);
    }

    /**
     * Loads the youtube iframe API asynchronously
     * @returns {promise} Used for knowing when the youtube player is ready or failed to load.
     */
    function loadPlayer() {
      var youtubeScript,
        youtubeElement,
        deferred,
        rejectTimer;

      if (isPlayerLoaded) {
        return $q.when();
      }

      // DOM manipulation exception:
      // Since we want to load the player just when we need it we have to do DOM manipulation on this service
      setWindowVariables();
      youtubeScript = document.createElement('script');
      youtubeElement = document.createElement('div');
      youtubeScript.src = 'https://www.youtube.com/iframe_api';
      youtubeElement.id = 'youtube';
      document.body.appendChild(youtubeScript);
      document.getElementById('providers').appendChild(youtubeElement);

      rejectTimer = setRejectTimer();
      deferred = $q.defer();
      return deferred.promise;

      ///////////
      /**
       * Sets a timer to reject the promise if the youtube api is taking too long
       * @returns {$timeout}
       */
      function setRejectTimer() {
        return $timeout(function() {
          deferred.reject();
        }, 7000);
      }

      /**
       * The youtube iframe API requires us to register some functions on the global scope. This function
       * sets those functions on the $window.
       */
      function setWindowVariables() {

        /**
         * Triggered when the youtube player is ready. Cancels the timer and resolves the loadPlayer() promise.
         */
        $window.onPlayerReady = function() {
          isPlayerLoaded = true;
          $timeout.cancel(rejectTimer);
          deferred.resolve();
        };

        /**
         * Triggered when the youtube player changes state. Publishes an event according to the new state.
         * @param {object} event The new state event
         */
        $window.onPlayerStateChange = function(event) {
          var newEvent = {
            service: 'youtube'
          };

          switch (event.data) {
            case YT.PlayerState.PLAYING:
              eventService.publish('playing', newEvent);
              break;
            case YT.PlayerState.PAUSED:
              eventService.publish('paused', newEvent);
              break;
            case YT.PlayerState.BUFFERING:
              eventService.publish('buffering', newEvent);
              break;
            case YT.PlayerState.ENDED:
              eventService.publish('ended', newEvent);
              break;
          }
        };

        /**
         * Triggered when the API finishes loading, sets the functions that we want to call on different events,
         * and create a youtube player.
         */
        $window.onYouTubeIframeAPIReady = function() {
          youtube = new YT.Player('youtube', {
            height: '200',
            width: '288',
            videoId: '',
            playerVars: {
              'controls': 0,        // Display controls on the player
              'iv_load_policy': 3,  // Hide video annotations
              'disablekb': 1,       // Disable keyboard controls
              'modestbranding': 1,  // Prevent the YouTube logo from displaying in the control bar
              'rel': 0,             // Hide related videos when playback of the initial video ends
              'showinfo': 0         // Hide information like the video title and uploader before the video starts playing.
            },
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
        };
      }
    }
  }
})();
