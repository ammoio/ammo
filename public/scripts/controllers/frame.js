angular.module('ammoApp')
  .controller('FrameController', function ($scope, $q, $location, ParseService, SearchService, UserService, QueueService, PlaylistService, StopClicksService, ngProgress) {

    /*************** scope variables ***************/
    $scope.UserService = UserService;
    $scope.QueueService = QueueService;
    $scope.PlaylistService = PlaylistService;
    $scope.location = $location;
    $scope.clickedIndex = null;
    $scope.songToAdd = null;
    $scope.playlistName = "";
    $scope.socket = io.connect($scope.location.host()); //initializing socket
    $scope.assetsLoaded = 0;// This variable is used to know when youtube and deezer are loaded ($scope.stopLoadingBar())

    /*************** run when loaded ***************/
    StopClicksService.disableClicks();
    UserService.verifyUser();
    //ngProgress is the top loading bar shown when first loading the page
    ngProgress.color('#2d9');
    ngProgress.start();


    /*************** $scope functions ***************/

    /*
      ========== $scope.search ==========
      Gets called when user clicks or hits enter on the search bar/button
      Checks if the input is a url. If so, parse url in ParseService, else call SearchService
      to search each API
    */
    $scope.search = function (userInput) {
      var isUrl = function (s) {
        var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);
      };

      //Call SearchService for each of the services
      $scope.userInput = ""; // clearing the input box
      $scope.searching = true;

      if (isUrl(userInput)) {
        ParseService.parseURL(userInput);
        $scope.searching = false;
      } else {
        $q.all([
          SearchService.rdio(userInput),
          SearchService.youtube(userInput),
          SearchService.soundcloud(userInput)
        ])
          .then(function (results) {
            results.forEach(function (result) {
              SearchService.searchResults = SearchService.searchResults.concat(result);
            });
            $scope.searching = false;
          });
      }
      $location.path('/search');
    };

    /*
      ======== saveToPlaylist ========
      Save the current queue to a playlist.
    */
    $scope.saveToPlaylist = function (name) {
      PlaylistService.saveToPlaylist(name)
        .then(function (playlist) {
          $scope.playlistName = "";
          $scope.showPlaylistInput = false;
          $location.path('/playlist/' + playlist.shareId);
        })
        .catch(function (err) {
          console.log("Error Saving Playlist", err);
        });
    };

    /*
      ========== $scope.shareRequestModal ==========
      -Called when shareRequestModal is filled out and "Share" is clicked. When modal is submitted
    */
    $scope.shareRequestModal = function () {
      QueueService.saveQueue($scope.queueName)
        .then(function () {
          $scope.closeModal();
          $('#shareResponseModal').addClass('md-show'); //show response modal
        });
    };

    /* ========== $scope.closeModal ==========
      hide all the modals
    */
    $scope.closeModal = function () {
      $('.md-show').removeClass('md-show');
    };

    /* ========== $scope.stopLoadingBar ==========
      In charge of stoping the top Loading Bar when all the players are loaded
      Params:
        asset: string with the name of the service player which is now ready.
        (this param may be used for debugging, but is not required)
    */
    $scope.stopLoadingBar = function (asset) {
      $scope.assetsLoaded += 1;
      if ($scope.assetsLoaded === 2) {
        ngProgress.complete();
        StopClicksService.enableClicks(); //enable clicking again
      }
    };

    /* ========== $scope.changePlaylist ==========
      Redirects user to /playlist/:id who then will display the tracks of that playlist

      Params:
        playlist: playlist object getting passed when a user clicks to a playlist name on the sidebar
    */
    $scope.changePlaylist = function (playlist) {
      $location.path('/playlist/' + playlist.shareId);
    };

    /* ========== $scope.togglePlaylistInput ==========
      toggle the playlist input box when clicked
    */
    $scope.togglePlaylistInput = function () {
      $scope.showPlaylistInput = !$scope.showPlaylistInput;
    };

    /* ========== $scope.setSongToAdd ==========
      Used so that the dropdown has access to specific songs to add to q's and playlists
    */
    $scope.setSongToAdd = function (song, $index) {
      if ($index !== undefined) {
        $scope.clickedIndex = $index;
      }
      $scope.songToAdd = song;
    };

    /* ========== $scope.showQueue ==========
      Redirects the user to /listen to load the queue
    */
    $scope.showQueue = function () {
      if (QueueService.live) {
        $location.path('/listen/' + QueueService.queue.listenId);
      } else {
        $location.path('/listen/');
      }
    };

    /* ========== $scope.fixTime ==========
      format the time from seconds for display
    */
    $scope.fixTime = function (seconds) {
      var mins = seconds / 60 | 0;
      seconds = seconds % 60 | 0;
      if (seconds < 10) {
        return mins + ":0" + seconds;
      }
      return mins + ":" + seconds;
    };

    $scope.goHome = function(){
      $location.path('/listen');
    };
  });


