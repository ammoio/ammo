angular.module('ammoApp')
//  This service is inteded to resolve the scrape www.theAudioDb.com for a given artist.
//  It calls the /scrape/:artist route on our server (needs to be done there to avoid cross-origin)
//  and receives an object which it will store in the storage object this.scraped.

//  Scrape theaudiodb.com
//  e.g. http://www.theaudiodb.com/api/v1/json/1/search.php?s=lionel%20Richie


  .service('ScraperService', function($http, $q) {
    this.scraped = {}; //local storage object

     /*
      ========== scrape ==========
      Scrape first takes the argument passed in, a string, and replaces any spaces with %20.
      It then does a lookup on theAudioDB.com for the artist name. Upon success, it assigns
      the response to a key (artist) in the this.scraped object.

      Params:
        param1: artist (string)

      Return:
        A promise that is resolved when the q is updated on the server
        The promise resolve with either true or false depending on whether the
        results were relevant or not
    */

    this.scrape = function(artist){
      var d = $q.defer();
      var that = this;
      var artistNoSpace = artist.replace(/\s/g,"%20");
      var url = "/scrape/" + artistNoSpace;

      $http.get(url)
      .success(function(info){
        if (info.artists !== null){
          that.scraped[artist] = info.artists[0];

          that.scraped[artist].images = [];
          that.scraped[artist].images.push(that.scraped[artist].strArtistThumb);
          that.scraped[artist].images.push(that.scraped[artist].strArtistFanart);
          that.scraped[artist].images.push(that.scraped[artist].strArtistFanart2);
          that.scraped[artist].images.push(that.scraped[artist].strArtistFanart3);

          d.resolve(true);
        }else {
          d.resolve(false);
        }
      })
      .error(function(err){
        console.log(artist + " info NOT scraped");
        d.reject(err);
      });

      return d.promise;
    };

  });
