(function() {
  'use strict';

  angular
    .module('ammo.services.providers.youtube.search', [])
    .factory('youtubeSearchService', youtubeSearchService);

  function youtubeSearchService() {
    var service = {
      search: search
    };

    return service;


    function search() {
      console.log('YouTube Search');
    }
  }
})();
