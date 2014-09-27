(function() {
  'use strict';

  angular
    .module('ammo.services.providers.youtube', [])
    .factory('youtubeService', youtubeService);

    function youtubeService($window, $q) {
      var isPlayerLoaded = false,
          service,
          youtube,
          songToPlay;

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
      function play(songId) {
        if (isPlayerLoaded) {
          youtube.loadVideoById(songId, 0, 'large');
          youtube.playVideo();
        } else {
          loadPlayer(songId);
        }
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

      function loadPlayer(songId) {
        setWindowVariables();
        var youtubeScript = document.createElement('script'),
            youtubeElement = document.createElement('div');

        youtubeScript.src = 'https://www.youtube.com/iframe_api';
        youtubeElement.id = 'youtube';
        document.body.appendChild(youtubeScript);
        document.getElementById('providers').appendChild(youtubeElement);
        songToPlay = songId;

        ///////////
        function setWindowVariables() {
          $window.onPlayerReady = function() {
            isPlayerLoaded = true;
            play(songToPlay);
          };

          $window.onPlayerStateChange = function(event) {
            // Register a new event to notify the player for state changes
            console.log('New event: ' + event);
            //YT.PlayerState.ENDED
            // eventService.publish(
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
//var onPlayerStateChange = function (event) {
//  var scope = angular.element(document.getElementById("youtube")).scope();
//
//  if (event.data === YT.PlayerState.ENDED) {
//    scope.playNext();
//    scope.$apply();
//  } else if (event.data === YT.PlayerState.BUFFERING) {
//    scope.buffering = true;
//  } else if (event.data === YT.PlayerState.PLAYING) {
//    scope.buffering = false;
//    scope.ready = true;
//    scope.unPause();
//  } else if (event.data === YT.PlayerState.PAUSED) {
//    scope.detectManualPause();
//  }
//};


//{
//  "title": "Summer",
//  "artist": "Calvin Harris",
//  "duration": 234,
//  "service": "youtube",
//  "serviceId": "ebXbLfLACGM",
//  "url": "http://youtu.be/ebXbLfLACGM",
//  "image": "https://i.ytimg.com/vi/ebXbLfLACGM/hqdefault.jpg",
//  "votes": 0
//},
