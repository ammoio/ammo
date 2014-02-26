angular.module('ammoApp')

  /*
  ========== SearchService ==========
  Search Service is divided by services functions (youtube, soundcloud)

  Params:
    userInput
      - whatever the user typed on the search box, used to create the url used in the ‘GET’ request
  Return:
    none.
    async GET returns an argument with a set of properties. See var song for reference.

  */
  .service('SearchService', function($http, $q, $rootScope, QueueService) {
    this.searchResults = []; // store search results

    var that = this; //reference to service object

    this.youtube = function(userInput, limit){
      this.searchResults = [];
      var youtubeResults = [];
      var d = $q.defer();

      limit = limit || 4;

      $http({ method: 'GET', url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=' + limit + '&q=' + userInput + '&type=video&videoCategoryId=10&key=AIzaSyCsNh0OdWpESmiBBlzjpMjvbrMyKTFFFe8' })
      .success(function(results) {
        var total = results.items.length;
        var resultsSoFar = 0; 

        results.items.forEach(function(video) {
          var service_id = video.id.videoId; // We need this here because we are using the service_id to generate the url

          var title = video.snippet.title.split(" - ");
          var artist = title.length > 1 ? title[0] : null;
          var track = title.length > 1 ? title[1]: title[0];

          var song = {
            title: track,
            artist: artist,
            service: "youtube",
            serviceId: service_id,
            url: "http://youtu.be/" + service_id,
            image: video.snippet.thumbnails.high.url
          };

          $http({ method: 'GET', url: 'https://www.googleapis.com/youtube/v3/videos?id=' + service_id + '&part=contentDetails&key=AIzaSyCsNh0OdWpESmiBBlzjpMjvbrMyKTFFFe8'})
          .success(function(newResults) {
            var duration = newResults.items[0].contentDetails.duration;

            var hours = duration.match(/(\d+)(?=[H])/ig)||[0];
            var minutes = duration.match(/(\d+)(?=[M])/ig)||[0];
            var seconds = duration.match(/(\d+)(?=[S])/ig)||[0];

            song.duration = (parseInt(hours) * 60 * 60) + parseInt(minutes) * 60 + parseInt(seconds);
            youtubeResults.push(song);
            resultsSoFar++;
            if(resultsSoFar === total) {
              d.resolve(youtubeResults);
            }
          })
          .error(function() {
            d.resolve([]);
          });
        });
      })
      .error(function() {
        d.resolve([]);
      });
      return d.promise;
    };

    this.rdio = function(userInput, limit) {
      limit = limit || 4;

      var rdioResults = [];
      var d = $q.defer();

      R.request({
        method: "search",
        content: {
          query: userInput,
          types: "track",
          extras: 'duration, baseIcon, canStream',
          count: limit
        },
        success: function(response) {
          var results = response.result.results;
          results.forEach(function(track) {
            if (track.canStream && track.canSample) { //can stream and sample
              var song = {
                url: track.shortUrl,
                service: 'rdio',
                serviceId: track.key,
                title: track.name,
                artist: track.artist,
                image: track.icon,
                duration: track.duration
              };
              $rootScope.$apply(function() {
                rdioResults.push(song);
              });
            }
          });
          d.resolve(rdioResults);
        },
        error: function(response) {
          console.log("error: " + response.message);
          d.resolve([]);
        }
      });
      return d.promise;
    };

    this.soundcloud = function(userInput) {
      //limit: number of results to return
      var limit = 4;
      var soundcloudResults = [];
      var d = $q.defer();

      //clientId for soundcloud api authorization
      var clientId = "456165005356d6638c4eabfc515d11aa";

      //searchUrl: get request url for query
      //"q" is the search query
      var searchUrl = "http://api.soundcloud.com/tracks?";
      searchUrl = searchUrl + "q=" + userInput + "&limit=" + limit + "&client_id=" + clientId + "&format=json";
      $http.get(searchUrl)
        .success(function(data, status, headers, config) {
          //add each returned track title to each list
          data.forEach(function(track) {
            if (track.streamable && track.sharing === 'public') { //*******if not streamable will throw error
              //relevant data for each song

              var title = track.title.split(" - ");
              var artist = title.length > 1 ? title[0] : track.user.username;
              var trackName = title.length > 1 ? title[1]: title[0];

              var song = {
                url: track.uri,
                service: 'soundcloud',
                serviceId: track.id,
                title: trackName,
                artist: artist,
                image: track.artwork_url,
                duration: Math.floor(track.duration/1000)
              };
              soundcloudResults.push(song);
            }
          });
          d.resolve(soundcloudResults);
        })
        .error(function(data, status, headers, config) {
          console.log('failed query');
          d.resolve([]);
        });
      return d.promise;
    };


    // This function needs refactor to promises
    this.deezer = function(userInput, access_token) {
      var limit = 4;
      access_token = "nyEmIZFFIK530171471e73bQR96KnJd530171471e777c3KmNh";
      // https://connect.deezer.com/oauth/auth.php?app_id=132563&redirect_uri=http://www.ammo.io&response_type=token&perms=offline_access
      // This access_token is necesary because Deezer is not available in the US ... but will be this year, querying their API with my 
      // access code will get results as of being in Mexico. (Viva Mexico!)

      $http.jsonp('http://api.deezer.com/search?q=' + userInput + '&TRACK_DESC=undefined&nb_items=' + limit +'&access_token='+access_token+'&output=jsonp&callback=JSON_CALLBACK')
        .success(function(results) {
          results.data.forEach(function(result) {
            var song = {
              artist: result.artist.name,
              title: result.title,
              duration: result.duration,
              service: "deezer",
              serviceId: result.id,
              url: result.link,
              image: result.album.cover
            };
            that.searchResults.push(song);
          });
        });
    };

    this.url = function(song) {
      that.searchResults.push(song);
    };
  });