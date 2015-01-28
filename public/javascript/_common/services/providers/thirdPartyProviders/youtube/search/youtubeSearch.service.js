(function() {
  'use strict';

  angular
    .module('ammo.youtube.search.service', [
      'ammo.youtube.searchApiV2.service',
      'ammo.youtube.searchApiV3.service'
    ])
    .factory('youtubeSearch', youtubeSearchService);

  function youtubeSearchService(youtubeSearchApiV2, youtubeSearchApiV3) {
    var service;

    service = {
      search: search
    };

    return service;

    ///////////
    /**
     * We use this function to decide if we want to search on YouTube's API V2 or V3.
     * @param {string} query Query user typed on the search box
     * @param {number} limit Limit the number of search results (integer)
     * @param {number} version YouTube API version
     * @returns {promise} Promise that will resolve to an array of song objects
     */
    function search(query, limit, version) {
      limit = limit || 5;
      version = version || 3;

      if (version === 2) {
        return youtubeSearchApiV2.search(query, limit);
      } else {
        return youtubeSearchApiV3.search(query, limit);
      }
    }
  }
}());
