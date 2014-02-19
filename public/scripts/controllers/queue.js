angular.module('ammoApp')

  .controller('QueueController', function($scope, $routeParams, $route, $location, QueueService, ScraperService) {
    $scope.artistImage = "http://www.theaudiodb.com/images/media/artist/thumb/xxtwus1340291734.jpg";

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

      Params:
        param1: index (number)

      Return: No return
    */

    $scope.passToPlay = function(index){
      if (QueueService.queue.songs[index].artist){
        $scope.loadArtistImage(QueueService.queue.songs[index].artist);
      }
      
      QueueService.setCurrentSongIndex(index);
      $scope.play(index, 'q');
    };

    $scope.loadArtistImage = function(artist){
      if (ScraperService.scraped[artist]){
        $scope.artistImage = ScraperService.scraped[artist].strArtistThumb;
      } else {
        ScraperService.scrape(artist)
        .then(function(data){
          $scope.artistImage = ScraperService.scraped[artist].strArtistThumb;
        });
      }
    };

    
  });