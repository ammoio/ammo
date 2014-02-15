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
  .service('SearchService', function($http, QueueService) {
    this.searchResults = []; // store search results

    var that = this; //reference to service object

    this.youtube = function(userInput){

      //emptying searchResults. Cannot assign empty array because controller/view will lose reference
      this.searchResults.splice(0, this.searchResults.length); // store search results
      
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

    this.soundcloud = function(userInput) {
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
              image: track.artwork_url,
              duration: Math.floor(track.duration/1000)
            };
            console.log(song.duration);
            that.searchResults.push(song);
          });
        }).
        error(function(data, status, headers, config) {
          console.log('failed query');
        }); 
    };
  });