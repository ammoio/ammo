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

  .service('ScraperService', function($http) {
    //Scrape theaudiodb.com
    //http://www.theaudiodb.com/api/v1/json/1/search.php?s=lionel%20Richie
    
    this.scraped = {}; //local storage object
    var imgOptions = {
      thumb: "strArtistThumb",
      fanart: "strArtistFanart",
      fanart2: "strArtistFanart2",
      fanart3: "strArtistFanart3"
    }

     /*
      ========== scrape ==========
      Scrape first takes the argument passed in, a string, and replaces any spaces with %20.
      It then does a lookup on theAudioDB.com for the artist name. Upon success, it assigns 
      the response to a key (artist) in the this.scraped object. 

      Params:
        param1: song (object)
          - a single song object

      Return:
        A promise that is resolved when the q is updated on the server
        The song that was added is passed to the promise.
    */

    this.scrape = function(artist){
      artistNoSpace = artist.replace(/\s/g,"%20");
      var url = "http://www.theaudiodb.com/api/v1/json/1/search.php?s=" + artistNoSpace; //REPLACE API KEY "1"

      $http({
        method: 'GET',
        url: url
      }).then(function(info){
        this.scraped[artist] = info;
        this.scraped[artist].images = {};
        this.getImages(artist);
      });
    };

    this.getImages = function(artist){
      for (var key in imgOptions){
        var url = this.scraped[artist][imgOptions[key]];
        $http({
        method: 'GET',
        url: url
      }).then(function(img){
        this.scraped[artist].images[imgOptions[key]] = img;
      });
      }
    };










  });

  $http({ method: 'GET', url: 'http://api.soundcloud.com/resolve.json?url=' + url + '&client_id=456165005356d6638c4eabfc515d11aa'})
        .then(function(track) {

          if(!track.data.streamable || track.data.sharing !== 'public') {
            alert("Track not streamable");
            console.log("Track not streamable");
            return;
          }
          var song = {
            url: track.data.permalink_url,
            service: 'soundcloud',
            serviceId: track.data.id,
            title: track.data.title,
            artist: track.data.user.username,
            image: track.data.artwork_url,
            duration: (track.data.duration/1000) | 0
          };

          SearchService.url(song);
        });
    };