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
  .service('SearchService', function($http) {
    this.youtube = function(userInput, callback){
      $http({ method: 'GET', url: 'https://gdata.youtube.com/feeds/api/videos?q=' + userInput + '&orderby=relevance&max-results=5&alt=json&v=2' })
      .then(function(results) {
        results.data.feed.entry.forEach(function(video) { 
          var service_id = video.media$group.yt$videoid.$t; // We need this here because we are using the service_id to generate the url

          var song = {
            title: video.title.$t,
            service: "youtube",
            service_id: service_id,
            url: "http://youtu.be/" + service_id,
            image: video.media$group.media$thumbnail[3].url,
            duration: video.media$group.yt$duration.seconds
          };
          callback(song);
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
            var searchResults = { 
              url: track.uri,
              service: 'soundcloud',
              service_id: track.id,
              title: track.title,
              artist: track.user.username,
              image: track.artwork_url
            };
            callback(searchResults, {name: track.title});
          });
        }).
        error(function(data, status, headers, config) {
          console.log('failed query');
        }); 
    };
  });