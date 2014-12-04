(function() {
  'use strict';

  angular
    .module('ammo.constants.service', [])
    .constant('constants', {
      searchTimeout: 3000,
      youtubeApiKey: 'AIzaSyCsNh0OdWpESmiBBlzjpMjvbrMyKTFFFe8' // ToDo: Seed the api key
    });

})();
