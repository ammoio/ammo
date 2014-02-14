angular.module('ammoApp')
  .service('QueueService', function($http){

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