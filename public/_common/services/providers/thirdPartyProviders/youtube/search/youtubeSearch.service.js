(function() {
  'use strict';

  angular
    .module('ammo.services.providers.youtube.search', [])
    .factory('youtubeSearchService', youtubeSearchService);

  function youtubeSearchService($http, $q, $timeout) {
    var apiKey = 'AIzaSyCsNh0OdWpESmiBBlzjpMjvbrMyKTFFFe8', // ToDo: Seed the api key
        service;

    service = {
      search: search
    };

    return service;

    ///////////
    /**
     * @param {string} query Query user typed on the search box
     * @param {integer} limit Limit the number of search results
     * @returns {promise} Promise that will resolve to an array of song objects
     */
    function search(query, limit) {
      var deferred = $q.defer(),
          rejectTimer = setRejectTimer();

      limit = limit || 5;

      getSearchResults()
        .then(function youtubeSearchSuccess(results) {
          var videos = results.data.items;

          if (_.isEmpty(videos)) {
            deferred.resolve([]);
            return;
          }
          return requestDetails(videos);
        })

        .then(function youtubeDetailsSuccess(results) {
          var videos;
          $timeout.cancel(rejectTimer);

          if (_.isUndefined(results)) {
            return;
          }
          videos = results.data.items;

          if (_.isEmpty(videos)) {
            deferred.resolve([]);
            return;
          }
          createSongObjects(videos);
        })

        .catch(function youtubeSearchError() {
          deferred.resolve([]);
        });
      return deferred.promise;


      ///////////
      /**
       * Search on youtube with the query the user typed
       * @returns {promise}
       */
      function getSearchResults() {
        return $http.get('https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              part: 'snippet',
              maxResults: limit,
              q: query,
              type: 'video',
              videoCategoryId: 10, // Music Category
              key: apiKey
            }
          }
        )
      }
      /**
       * Request more details from the videos returned from the search result since the search API won't return
       * all we need.
       * @param {array} videos Array of video objects
       * @returns {promise}
       */
      function requestDetails(videos) {
        var videoIds;

        videoIds = _.map(videos, function(video) {
          return video.id.videoId ;
        });
        videoIds = videoIds.join(',');

        return $http.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'snippet,contentDetails',
            id: videoIds,
            key: apiKey
          }
        })
      }

      /**
       * Creates the array of song objects with the API data
       * @param {array} videos Array of detailed video objects
       */
      function createSongObjects(videos) {
        var songs,
            name;

        songs = _.map(videos, function(video) {
          name = video.snippet.title.split(' - ');

          return {
            artist: name.length > 1 ? name[0] : null,
            title: name.length > 1 ? name[1] : name[0],
            duration: timeToSeconds(video.contentDetails.duration),
            service: 'youtube',
            serviceId: video.id,
            url: 'http://youtu.be/' + video.id,
            image: video.snippet.thumbnails.high.url
          };
        });
        deferred.resolve(songs);
      }

      /**
       * Sets a timer to reject the promise if the youtube api is taking too long
       * @returns {$timeout}
       */
      function setRejectTimer() {
        return $timeout(function() {
          deferred.resolve([]);
        }, 5000);
      }

      /**
       * Youtube return the video duration in ISO 8601 durations (e.g: PT10M46S), this function returns
       * the time in seconds
       * @param time Time in ISO 8601 format
       * @returns {integer} time in seconds
       */
      function timeToSeconds(time) {
        var hours = time.match(/(\d+)(?=[H])/ig) || [0],
            minutes = time.match(/(\d+)(?=[M])/ig) || [0],
            seconds = time.match(/(\d+)(?=[S])/ig) || [0];

        return (parseInt(hours, 10) * 60 * 60) + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
      };
    }
  }
})();
