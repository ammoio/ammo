(function() {
  'use strict';

  angular
    .module('ammo.youtube.searchApiV2.service', [
      'ammo.constants.service'
    ])
    .factory('youtubeSearchApiV2', youtubeSearchApiV2Service);

  function youtubeSearchApiV2Service($http, $q, constants) {
    var service;

    service = {
      search: search
    };

    return service;

    ///////////
    /**
     * @param {string} query Query user typed on the search box
     * @param {number} limit Limit the number of search results (integer)
     * @returns {promise} Promise that will resolve to an array of song objects
     */
    function search(query, limit) {
      var deferred = $q.defer();

      getSearchResults()
        .then(function youtubeSearchSuccess(results) {
          var videos = results.data.data.items;

          if (!videos) {
            deferred.reject();
          }

          return videos;
        })
        .then(function youtubeVideos(videos) {
          deferred.resolve(createSongObjects(videos));
        })
        .catch(function youtubeSearchError() {
          deferred.reject();
        });

      return deferred.promise;

      ///////////
      /**
       * Search on youtube with the query the user typed
       * @returns {promise}
       */
      function getSearchResults() {
        return $http.get('http://gdata.youtube.com/feeds/api/videos',
          {
            timeout: constants.searchTimeout,
            params: {
              'alt': 'jsonc',
              'max-results': limit,
              'q': query,
              'v': 2
            }
          });
      }

      /**
       * Creates the array of song objects with the API data
       * @param {array} videos Array of returned videos from API
       * @returns {array} Array of song objects
       */
      function createSongObjects(videos) {
        var songs;

        songs = _.map(videos, function (video) {
          var name = video.title.split(' - ');

          return {
            artist: name.length > 1 ? name[0] : null,
            title: name.length > 1 ? name[1] : name[0],
            duration: video.duration,
            service: 'youtube',
            serviceId: video.id,
            url: 'http://youtu.be/' + video.id,
            image: video.thumbnail.hqDefault
          };
        });

        return songs;
      }
    }
  }
}());
