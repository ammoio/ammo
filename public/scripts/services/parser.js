angular.module('ammoApp')

  .service('ParseService', function($http) {
    this.youtube = function(url){
      var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);

      if (match && match[1].length === 11){
        return match[1];
      } else {
        return null;
      }
    };

    this.spotify = function(url) {
      return "spotify:track:" + url.substring(url.lastIndexOf('/') + 1);
    };

    this.soundcloud = function(url) {
      return $http({ method: 'GET', url: 'http://api.soundcloud.com/resolve.json?url=' + url + '&client_id=456165005356d6638c4eabfc515d11aa'});
    };
  });