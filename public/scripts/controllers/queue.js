angular.module('ammoApp')

  .controller('QueueController', function($scope, $routeParams, $route, $location, QueueService, ScraperService) {
    $scope.artistImage = "";

    /*
      This code checks if there was an ID included in the route. and
      handles the cases accordingly.
    */

    //If there was a id included as part of the route
    if( $routeParams.id ){
      //Check if the id provided matches whats already loaded in the queue
      if( $routeParams.id === QueueService.queue.shareId ){
        //We do not need to fetch the info from the server, as we already have it.
        $scope.songs = QueueService.queue.songs;
      } else {
        //If it does not match, get the Queue from the server, and set the songs
        QueueService.getQueue($routeParams.id)
        .then(function(queue){
          $scope.songs = queue.songs;
        });
      }
    //else, the path did not include an ID
    } else {
      //if the current queue is live
      if(QueueService.live){
        //reset the queue to a default
        $scope.songs = QueueService.resetQueue().songs;
      } else {
        //else, keep the existing songs loaded
        $scope.songs = QueueService.queue.songs;
      }
    }


    /*
      ========== removSong ==========
      -Triggered from a click on the "removeSong" button. Call QueueService's removeSongAtIndex.

      Params:
        index: the index of the song in queue using $index

      Return: No return
    */
    $scope.removeSong = function(index) {
      QueueService.removeSongAtIndex(index);
    };


    /*
      ========== share ==========
      -Triggered from a click on the "share" button. Displays modal to prompt for playlist name and passphrase.

      Params:
        None

      Return: No return
    */

    $scope.share = function() {
      if (QueueService.live) {
        var shareLink = 'http://localhost/' + QueueService.queue.shareId;
        $('.twitter-share-button').attr({
          'data-url': shareLink,
          'data-text': "Hey, checkout this playlist I made!\n"
        }); //dynamically set the url

        $('#shareResponseModal').modal(); //show response modal
      } else {
        $('#shareRequestModal').modal();
      }
    };

    
    
    /*
      ========== passToPlay ==========
      -Triggered from an ng-click on a song in the queue. Takes an index, sets it as the current song index, 
      then passes it along to the play function.
      -Before playing it sets the scope.artistImage variable, either by using the scraping service
      (scope.loadArtistImage) or by using the song.image if there is no scrape data. 

      Params:
        param1: index (number)

      Return: No return
    */

    $scope.passToPlay = function(index){
      QueueService.setCurrentSongIndex(index); //needs to happen before scraping

      if (QueueService.queue.songs[index].artist){
        $scope.loadArtistImages(QueueService.queue.songs[index].artist);
      }else{
        $scope.artistImage = QueueService.queue.songs[QueueService.queue.currentSong].image;
      }
      
      $scope.play(index, 'q');
    };

    /*
      ========== loadArtistImages ==========
      -Checks the scraper service to see if the artist passed in has been scraped before. If it 
      has, it will set the $scope.artistImage to the previously scraped images. If the artists 
      has not been scraped, it will call the ScraperService.scrape(artist) function, will set
      the scope.artistImage to the results, or if there are no results, then to the song.image. 

      Params:
        param1: artist(string)

      Return: No return
    */

    $scope.loadArtistImages = function(artist){
      //add functionality to display youtube image if no other image found
      if (ScraperService.scraped[artist]){
          $scope.setArtistImage(artist);
      } else {
        ScraperService.scrape(artist)
        .then(function(data){
          $scope.setArtistImage(artist);
        });
      }
    };

    /*
      ========== setArtistImage ==========
      -sets the $scope.artistImage to a random image from the scraper, or the song.image

      Params:
        param1: artist(string)

      Return: No return
    */

    $scope.setArtistImage = function(artist){
      var rand = Math.floor(Math.random()*4);
      var scraped = ScraperService.scraped;
      var songs = QueueService.queue.songs;
      var cur = QueueService.queue.currentSong;
      var currentImg = scraped[artist].images[rand]

      if (currentImg === "" || currentImg === null){
        $scope.artistImage = songs[cur].image;
      }else {
        $scope.artistImage = currentImg;
      }
    };

    
  });