(function() {
  'use strict';

  angular
    .module('ammo.soundcloud.search.service', [
      'ammo.constants.service'
    ])
    .factory('soundcloudSearch', soundcloudSearchService);

  function soundcloudSearchService($http, $q, constants) {
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

      limit = limit || 5;

      getSearchResults()
        .then(function soundcloudSearchSuccess(results) {
          deferred.resolve(createSongObjects(results.data));
        })
        .catch(function soundcloudSearchError() {
          deferred.reject();
        });

      return deferred.promise;

      ///////////
      /**
       * Search on soundcloud with the query the user typed
       * @returns {promise}
       */
      function getSearchResults() {
        return $http.get('http://api.soundcloud.com/tracks?',
          {
            timeout: constants.searchTimeout,
            params: {
              'limit': limit,
              'q': query,
              'client_id': constants.soundcloudClientId,
              'format': 'json'
            }
          });
      }

      /**
       * Creates the array of song objects with the API data
       * @param {array} songs Array of returned songs from API
       * @returns {array} Array of song objects
       */
      function createSongObjects(songs) {
        var songArray = [],
            name;

        _.each(songs, function(song) {
          if (song.streamable && song.sharing === 'public') {
            name = song.title.split(' - ');

            songArray.push({
              artist: name.length > 1 ? name[0] : null,
              title: name.length > 1 ? name[1] : name[0],
              duration: Math.floor(song.duration / 1000),
              service: 'soundcloud',
              serviceId: song.id,
              url: song.uri,
              image: song.artwork_url
            });
          }
        });

        return songArray;
      }
    }
  }
}());

