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

  .service('ScraperService', function($http, $q) {
    //Scrape theaudiodb.com
    //http://www.theaudiodb.com/api/v1/json/1/search.php?s=lionel%20Richie
    
    this.scraped = {}; //local storage object

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

    this.scrape = function(artist){ //CURRENTLY ONLY WORKS FOR SOUNDCLOUD AS YOUTUBE DOESNT HAVE ARTISTS
      var d = $q.defer();
      var that = this;
      var artistNoSpace = artist.replace(/\s/g,"%20");
      //var url = "/scrape/" + artistNoSpace; //REPLACE API KEY "1"
      var url = "/scrape/creed"// JUST FOR TESTINg


      $http.get(url)
      .success(function(info){
        console.log(info);
        that.scraped[artist] = info.artists[0];
        console.log(artist + " info scraped");
        d.resolve(that.scraped);
      })
      .error(function(err){
        console.log(artist + " info NOT scraped");
        d.reject(err);
      });

      return d.promise;
    };

  });
