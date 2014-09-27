(function() {
  'use strict';

  angular
    .module('ammo.services.providers.youtube', [])
    .factory('youtubeService', youtubeService);

    function youtubeService($window, $q, $timeout, eventService) {
      var isPlayerLoaded = false,
          service,
          youtube;

      service = {
        loadPlayer: loadPlayer,
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
      function play(song) {
        loadPlayer()
          .then(function successLoadPlayer() {
            youtube.loadVideoById(song.serviceId, 0, 'large');
            youtube.playVideo();
          });
      }

      function pause() {
        youtube.pauseVideo();
      }

      function unPause() {
        youtube.playVideo();
      }

      function seekTo(seconds) {
        youtube.seekTo(seconds, true);
      }

      function stop() {
        youtube.stopVideo();
      }

      function mute() {
        youtube.mute();
      }

      function unMute() {
        youtube.unMute();
      }

      // volume = 0 to 100
      function setVolume(volume) {
        youtube.setVolume(volume);
      }

      function loadPlayer() {
        var youtubeScript,
            youtubeElement,
            deferred,
            rejectTimer;

        if (isPlayerLoaded) {
          return $q.when();
        }

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
        function setRejectTimer() {
          return $timeout(function() {
            deferred.reject();
            eventService.publish('error', 'Failed to load YouTube Player');
          }, 7000);
        }

        function setWindowVariables() {
          $window.onPlayerReady = function() {
            isPlayerLoaded = true;
            $timeout.cancel(rejectTimer);
            deferred.resolve();
          };

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
