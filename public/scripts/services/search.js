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
  .service('SearchService', function($http, $q, $rootScope, $timeout, QueueService) {
    this.searchResults = []; // store search results

    var that = this; //reference to service object


    this.youtube = function(userInput, limit){
      this.searchResults = [];
      var d = $q.defer();

      limit = limit || 4;

      getYoutubeSongs(userInput, limit, d);
      return d.promise;
    };


    this.rdio = function(userInput, limit, timeLimit) {
      limit = limit || 4;
      var d = $q.defer();

      //do a time limit for searching
      timeLimit = timeLimit || 2500; //3 seconds  

      getRdioSongs(userInput, limit, timeLimit, d);
      return d.promise;
    };


    this.soundcloud = function(userInput, limit) {
      //limit: number of results to return
      limit = limit || 4;
      var d = $q.defer();
      var clientId = "456165005356d6638c4eabfc515d11aa"; //clientId for soundcloud api authorization

      //searchUrl: get request url for query
      //"q" is the search query
      var searchUrl = "http://api.soundcloud.com/tracks?";
      searchUrl = searchUrl + "q=" + userInput + "&limit=" + limit + "&client_id=" + clientId + "&format=json";

      getSoundcloudSongs(searchUrl, d);
      return d.promise;
    };


    this.url = function(song) {
      that.searchResults.push(song);
    };


    //////////////// Helper Function ///////////////////
    var timeToSeconds = function(time) {
      var hours = time.match(/(\d+)(?=[H])/ig)||[0];
      var minutes = time.match(/(\d+)(?=[M])/ig)||[0];
      var seconds = time.match(/(\d+)(?=[S])/ig)||[0];

      return (parseInt(hours) * 60 * 60) + parseInt(minutes) * 60 + parseInt(seconds);
    };


    var createSongObject = function(ti, ar, du, se, seId, url, img) { // title, artist, duration, service, serviceId, url, image
      return {
        title: ti,
        artist: ar,
        duration: du,
        service: se,
        serviceId: seId,
        url: url,
        image: img 
      };
    };


    var getYoutubeSongs = function(userInput, limit, d){
      $http({ method: 'GET', url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=' + limit + '&q=' + userInput + '&type=video&videoCategoryId=10&key=AIzaSyCsNh0OdWpESmiBBlzjpMjvbrMyKTFFFe8' })
      .success(function(results) {
        var youtubeResults = [];
        var compare = {
          total: results.items.length,
          resultsSoFar: 0
        };

        results.items.forEach(function(video) {
          getVideoData(video, youtubeResults, compare, d);
        });
      })
      .error(function() {
        d.resolve([]);
      });
    };


    var getVideoData = function(video, youtubeResults, compare, d){
      var service_id = video.id.videoId; // We need this here because we are using the service_id to generate the url
      $http({ method: 'GET', url: 'https://www.googleapis.com/youtube/v3/videos?id=' + service_id + '&part=contentDetails&key=AIzaSyCsNh0OdWpESmiBBlzjpMjvbrMyKTFFFe8' })
      .success(function(newResults) {
        if(newResults.pageInfo.totalResults === 0) {
          compare.total--;
          return;
        }
        var title = video.snippet.title.split(" - ");
        var artist = title.length > 1 ? title[0] : null;
        var track = title.length > 1 ? title[1]: title[0];
        var duration = timeToSeconds(newResults.items[0].contentDetails.duration);
        var song = createSongObject(track, artist, duration, "youtube", service_id, "http://youtu.be/" + service_id, video.snippet.thumbnails.high.url);

        youtubeResults.push(song);
        compare.resultsSoFar++;

        if(compare.resultsSoFar === compare.total) {
          d.resolve(youtubeResults);
        }
      })
      .error(function() {
        d.resolve([]);
      });
    };


    var getSoundcloudSongs = function(searchUrl, d) {
      $http.get(searchUrl)
        .success(function(data) {
          var soundcloudResults = [];

          data.forEach(function(track) {
            if (track.streamable && track.sharing === 'public') { //*******if not streamable will throw error

              var title = track.title.split(" - ");
              var artist = title.length > 1 ? title[0] : track.user.username;
              var trackName = title.length > 1 ? title[1]: title[0];
              var song = createSongObject(trackName, artist, Math.floor(track.duration/1000), "soundcloud", track.id, track.uri, track.artwork_url);

              soundcloudResults.push(song);
            }
          });
          d.resolve(soundcloudResults);
        })
        .error(function(data) {
          console.log('failed query');
          d.resolve([]);
        });
    };


    var getRdioSongs = function(userInput, limit, timeLimit, d) {
      var rdioTimer = $timeout(function() {
        d.resolve([]);
      }, timeLimit);

      R.request({
        method: "search",
        content: {
          query: userInput,
          types: "track",
          extras: 'duration, baseIcon, canStream',
          count: limit
        },
        success: function(response) {
          rdioSuccess(response, rdioTimer, d);
        },
        error: function(response) {
          console.log("error: " + response.message);
          d.resolve([]);
        }
      });
    };


    var rdioSuccess = function(response, rdioTimer, d) {
      $timeout.cancel(rdioTimer);
      var results = response.result.results;
      var rdioResults = [];

      results.forEach(function(track) {
        if (track.canStream && track.canSample) { //can stream and sample
          var song = createSongObject(track.name, track.artist, track.duration, "rdio", track.key, track.shortUrl, track.icon);

          $rootScope.$apply(function() {
            rdioResults.push(song);
          });
        }
      });
      d.resolve(rdioResults);
    };
  });

  


    //  ***********  DO NOT DELETE THIS FUNCTION/Comment will be used when Deezer is available in the US (soon)  **********// 
    // This function needs refactor to promises
    // this.deezer = function(userInput, access_token) {
    //   var limit = 4;
    //   access_token = "nyEmIZFFIK530171471e73bQR96KnJd530171471e777c3KmNh";
    //   // https://connect.deezer.com/oauth/auth.php?app_id=132563&redirect_uri=http://www.ammo.io&response_type=token&perms=offline_access
    //   // This access_token is necesary because Deezer is not available in the US ... but will be this year, querying their API with my 
    //   // access code will get results as of being in Mexico. (Viva Mexico!)

    //   $http.jsonp('http://api.deezer.com/search?q=' + userInput + '&TRACK_DESC=undefined&nb_items=' + limit +'&access_token='+access_token+'&output=jsonp&callback=JSON_CALLBACK')
    //     .success(function(results) {
    //       results.data.forEach(function(result) {
    //         var song = {
    //           artist: result.artist.name,
    //           title: result.title,
    //           duration: result.duration,
    //           service: "deezer",
    //           serviceId: result.id,
    //           url: result.link,
    //           image: result.album.cover
    //         };
    //         that.searchResults.push(song);
    //       });
    //     });
    // };
    //  ***********  DO NOT DELETE THIS FUNCTION/Comment will be used when Deezer is available in the US (soon)  **********// 
