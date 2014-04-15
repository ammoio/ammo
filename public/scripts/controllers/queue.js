angular.module('ammoApp')

  .controller('QueueController', function ($scope, $http, $routeParams, $location, QueueService) {
    //$scope.artistImage = QueueService.currentImage;
    $scope.QueueService = QueueService;

    //When the share ids match, then update view
    $scope.socket.on('updateView', function (data) {
      if (data.shareId === QueueService.queue.shareId) {
        QueueService.getQueue(QueueService.queue.shareId);
      }
    });
    /*
      This code checks if there was an ID included in the route. and
      handles the cases accordingly.
    */

    //If there was a id included as part of the route
    if ($routeParams.id && $routeParams.id.length === 16) {
      //Check if the id provided matches whats already loaded in the queue
      if ($routeParams.id === QueueService.queue.listenId) {
        //We do not need to fetch the info from the server, as we already have it.
        $scope.songs = QueueService.queue.songs;
      } else {
        //If it does not match, get the Queue from the server, and set the songs
        QueueService.getQueue($routeParams.id)
          .then(function (queue) {
            $scope.songs = queue.songs;
          });
      }
    //if there was in invalid ID
    } else if ($routeParams.id) {
      $location.path('/listen/');
    //else, the path did not include an ID
    } else {
      //if the current queue is live
      if (QueueService.live) {
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
    $scope.removeSong = function ($event, index) {
      $event.stopPropagation();
      QueueService.removeSongAtIndex(index)
        .then(function () {
          if (QueueService.queue.shareId) {
            $scope.socket.emit('queueChanged', {
              shareId: QueueService.queue.shareId
            });
          }
        });
    };


    /*
      ========== share ==========
      -Triggered from a click on the "share" button. Displays modal to prompt for playlist name and passphrase.

      Params:
        None

      Return: No return
    */

    $scope.share = function () {
      if (QueueService.live || QueueService.queue.shareId) {
        var shareLink = 'http://localhost/' + QueueService.queue.shareId;
        $('.twitter-share-button').attr({
          'data-url': shareLink,
          'data-text': "Hey, checkout this playlist I made!\n"
        }); //dynamically set the url

        $('#shareResponseModal').addClass('md-show'); //show response modal
      } else {
        $('#shareRequestModal').addClass('md-show');
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

    $scope.passToPlay = function (index) {
      if (QueueService.isShuffled) {
        QueueService.shuffledIndex = QueueService.shuffleStore.indexOf(index); //inefficient?
      }

      QueueService.setCurrentSongIndex(index)
        .then(function (ind) {
          $scope.play(ind, "q");
        })
        .catch(function (err) {
          console.log("Error: ", err);
        });
    };

    $scope.updateQueue = function () {
      var i;
      var currentSong = $scope.currentSong;

      for (i = 0; i < QueueService.queue.songs.length; i++) {
        if (QueueService.queue.songs[i] === currentSong) {
          QueueService.queue.currentSong = i;
          QueueService.setNextSongs(i);
          break;
        }
      }
      $scope.$apply();
      if (QueueService.live) {
        $http.put('/queues/' + QueueService.queue.shareId, { songs: QueueService.queue.songs });
      }
    };

    $scope.tiles1 = [{
      searchString: "BEYONCE",
      imgUrl: "http://www.theaudiodb.com/images/media/album/thumb/qxrupw1387383515.jpg/preview"
    },{
      searchString: "KATY PERRY PRISM",
      imgUrl: "http://www.theaudiodb.com/images/media/album/thumb/wqtwqr1379211981.jpg/preview"
    },{
      searchString: "DAFT PUNK RANDOM ACCESS MEMORIES",
      imgUrl: "http://www.theaudiodb.com/images/media/album/thumb/random-access-memories-51764651042e5.jpg/preview"
    },{
      searchString: "JOHN LEGEND LOVE IN THE FUTURE",
      imgUrl: "http://www.theaudiodb.com/images/media/album/thumb/vspsyr1377914815.jpg/preview"
    },{
      searchString: "DRAKE NOTHING WAS THE SAME",
      imgUrl: "http://www.theaudiodb.com/images/media/album/thumb/wxsuqt1379204523.jpg/preview"
    }];

    $scope.tiles2 = [{
      searchString: "LORDE PURE HEROIN",
      imgUrl: "http://www.theaudiodb.com/images/media/album/thumb/tpvsus1382103853.jpg/preview"
    },{
      searchString: "ONE REPUBLIC NATIVE",
      imgUrl: "http://www.theaudiodb.com/images/media/album/thumb/native-514bdf9aa7b9b.jpg/preview"
    },{
      searchString: "BECK MORNING PHASE",
      imgUrl: "http://www.theaudiodb.com/images/media/album/thumb/qrsuvu1391184914.jpg/preview"
    },{
      searchString: "MILEY CYRUS BANGERZ",
      imgUrl: "http://www.theaudiodb.com/images/media/album/thumb/wqyvpq1378882084.jpg/preview"
    },{
      searchString: "JASON DERULO TATTOOS",
      imgUrl: "http://www.theaudiodb.com/images/media/album/thumb/tattoos-524cc41230952.jpg/preview"
    }];

  });

  


