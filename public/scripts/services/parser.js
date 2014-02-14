angular.module('ammoApp')
//  This service is inteded to resolve the ID's of any given valid url
//  
//  === Important Note === 
//  soundcloud resolver is async returns a promise 
//
//  Examples: 
//    ParseService.youtube("http://www.youtube.com/watch?v=11Y6Tqw17BM") ->  "11Y6Tqw17BM"
//    ParseService.youtube("http://youtu.be/11Y6Tqw17BM")                ->  "11Y6Tqw17BM"
//    ParseService.spotify("http://open.spotify.com/track/5jmFq0Mlx1eV6h1UhtT3iU") -> "spotify:track:5jmFq0Mlx1eV6h1UhtT3iU"   
//    ParseService.soundcloud("https://soundcloud.com/madeon/madeon-live-triple-j-mix") -> Promise 
//    then you need to resolve the promise and it returns a song object, you can see an example of a resolved one here:
//    http://api.soundcloud.com/tracks/82964169.json?client_id=456165005356d6638c4eabfc515d11aa

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