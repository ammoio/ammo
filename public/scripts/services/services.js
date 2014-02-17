angular.module('ammoApp')
  .service('Services', function($http){

    
      /* 
      ========== soundcloudSearch ==========
      Takes the userInput (from the search box) and form a searchUrl.
      Do a GET request to searchUrl. Save the relevant song meta data through the passed in call back function.

      Params: 
        param1 userInput
          - search query. Obtained from search box

        param2 cb
          - call back function to call on each of the returned tracks. Saves the song in $scope.searchResults

      Return: 
        No return
    */    
    this.soundcloudSearch = function(userInput, cb) {
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
            var searchResult = { 
              url: track.uri,
              service: 'soundcloud',
              service_id: track.id,
              title: track.title,
              artist: track.user.username,
              image: track.artwork_url
            };
            console.log(searchResult);
            cb(searchResult, {name: track.title});
          });
        }).
        error(function(data, status, headers, config) {
          console.log('failed query');
        }); 
    };
    
    /*
      ========== soundcloudSearch ==========
      When share button is clicked, take the current searchResults and do a post request to '/queue'

      Params: 
        param1 searchResults
          - an array of songs, each with relevant song metadata

      Return: 
        No return
    */    
    this.saveQueue = function(searchResults) {
      var newQueue = {
        name: "new queue",
        passphrase: "secret",
        currentSong: 0,
        searchResults: searchResults
      };
      $http.post('/queues', newQueue).
      success(function(data, status, headers, config) {
        console.log('posted');
      })
      .error(function(){
        console.log('post error');
      });
    };
  });