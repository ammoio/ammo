(function() {
  'use strict';

  angular
    .module('ammo.constants.service', [])
    .constant('constants', {
      searchTimeout: 3000,
      youtubeApiKey: 'AIzaSyCsNh0OdWpESmiBBlzjpMjvbrMyKTFFFe8', // ToDo: Seed the api key
      soundcloudClientId: '456165005356d6638c4eabfc515d11aa'
    });

})();
