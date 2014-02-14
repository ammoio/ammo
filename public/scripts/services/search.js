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
  });