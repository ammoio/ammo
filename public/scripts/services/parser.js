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

  .service('ParseService', function($http, SearchService) {
    this.youtube = function(url){
      var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);

      if (match && match[1].length === 11){
        // return match[1];
        var id = match[1];

        $http({ method: 'GET', url: 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&part=snippet,contentDetails&key=AIzaSyCsNh0OdWpESmiBBlzjpMjvbrMyKTFFFe8' })
          .then(function(results) {
            var duration = results.data.items[0].contentDetails.duration;
            var hours = duration.match(/(\d+)(?=[H])/ig)||[0]; 
            var minutes = duration.match(/(\d+)(?=[M])/ig)||[0]; 
            var seconds = duration.match(/(\d+)(?=[S])/ig)||[0]; 

            var song = {
              duration: parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds),
              service: "youtube",
              serviceId: id,
              title: results.data.items[0].snippet.title,
              image: results.data.items[0].snippet.thumbnails.high.url,
              url: "http://youtu.be/" + id
            };
            SearchService.searchResults = [];
            SearchService.url(song);
          });

      } else {
        console.log("YouTube url not vaild");
      }
    };

    this.spotify = function(url) {
      var id = "spotify:track:" + url.substring(url.lastIndexOf('/') + 1);

      $http({ method: 'GET', url: 'http://ws.spotify.com/lookup/1/.json?uri=' + id})
        .success(function(data, status) {
          SearchService.searchResults = [];

          var youtubeKeyword = data.track.artists[0].name + " - " + data.track.name;
          SearchService.youtube(youtubeKeyword, 1)
          .then(function(song) {
            SearchService.searchResults.push(song[0]);
          });

          var rdioKeyword = data.track.artists[0].name + " " + data.track.name + " " + data.track.album.name;
          SearchService.rdio(rdioKeyword, 1)
          .then(function(song) {
            SearchService.searchResults.push(song[0]);
          });
        });
    };

    this.soundcloud = function(url) {
      $http({ method: 'GET', url: 'http://api.soundcloud.com/resolve.json?url=' + url + '&client_id=456165005356d6638c4eabfc515d11aa'})
        .then(function(track) {

          if(!track.data.streamable || track.data.sharing !== 'public') {
            alert("Track not streamable");
            console.log("Track not streamable");
            return;
          }
          var song = {
            url: track.data.permalink_url,
            service: 'soundcloud',
            serviceId: track.data.id,
            title: track.data.title,
            artist: track.data.user.username,
            image: track.data.artwork_url,
            duration: (track.data.duration/1000) | 0
          };
          SearchService.searchResults = [];
          SearchService.url(song);
        });
    };

    this.rdio = function(url) {
      var userInput = url.replace(/artist\/|album\/|track|_/g, " ").split('/');
      userInput.splice(0,3);
      userInput = userInput.join(" ");
      SearchService.searchResults = [];
      SearchService.rdio(userInput, 1, 5000)
      .then(function(song) {
        if(song.length !== 0) {
          SearchService.searchResults.push(song[0]);
        }
      });
    };

    this.parseURL = function(url) {
      if(url.indexOf("youtu") !== -1) {
        this.youtube(url);
      }
      else if(url.indexOf("soundcloud") !== -1) {
        this.soundcloud(url);
      }
      else if(url.indexOf("deezer") !== -1) {

      }
      else if(url.indexOf("spotify") !== -1) {
        this.spotify(url);
      }
      else if (url.indexOf("rdio") !== -1) {
        this.rdio(url);
      }
    };
  });