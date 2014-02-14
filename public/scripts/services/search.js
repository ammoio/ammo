angular.module('ammoApp')

  /* 
  ========== SearchService ==========
  Search Service is divided by services functions (youtube, soundcloud) 

  Each function receives the following paramteres...  

  Params: 
    userInput
      - whatever the user typed on the search box, used to create the url used in the ‘GET’ request

    callback
      - (function) When the http request gets a response it calls the callback with the song object generated when resolving the http request.
*/
  .service('SearchService', function($http, QueueService) {
    this.searchResults = []; // store search results
    var that = this; //reference to service object

    this.youtube = function(userInput, callback){
      $http({ method: 'GET', url: 'https://gdata.youtube.com/feeds/api/videos?q=' + userInput + '&category=music&orderby=relevance&max-results=5&alt=json&v=2' })
      .then(function(results) {
        results.data.feed.entry.forEach(function(video) { 
          var service_id = video.media$group.yt$videoid.$t; // We need this here because we are using the service_id to generate the url

          var song = {
            title: video.title.$t,
            service: "youtube",
            serviceId: service_id,
            url: "http://youtu.be/" + service_id,
            image: video.media$group.media$thumbnail[3].url,
            duration: video.media$group.yt$duration.seconds
          };
          that.searchResults.push(song);
        });
      });
    };

    this.soundcloud = function(userInput, callback) {
      //limit: number of results to return
      var limit = 3;

      //clientId for soundcloud api authorization
      var clientId = "456165005356d6638c4eabfc515d11aa";

      //searchUrl: get request url for query
      //"q" is the search query
      var searchUrl = "http://api.soundcloud.com/tracks?";
      searchUrl = searchUrl + "q=" + userInput + "&limit=" + limit + "&client_id=" + clientId + "&format=json";

      $http.get(searchUrl).
        success(function(data, status, headers, config) {
          //add each returned track title to each list
          data.forEach(function(track) {
            //relevant data for each song
            var song = { 
              url: track.uri,
              service: 'soundcloud',
              serviceId: track.id,
              title: track.title,
              artist: track.user.username,
              image: track.artwork_url
            };
            that.searchResults.push(song);
          });
        }).
        error(function(data, status, headers, config) {
          console.log('failed query');
        }); 
    };
  });