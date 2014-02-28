angular.module('ammoApp')
  .controller('FrameController', function($scope, $q, $http, $location, $cookies, ParseService, SearchService, UserService, QueueService, StopClicksService, ngProgress) {

    /*************** scope variables ***************/
    $scope.UserService = UserService;
    $scope.QueueService = QueueService;
    $scope.location = $location;
    $scope.clickedIndex = null;
    $scope.songToAdd = null;
    $scope.playlistName = "";
    //initializing socket
    $scope.socket = io.connect($scope.location.host());
    // This variable is used to know when youtube
    // and deezer are loaded ($scope.stopLoadingBar())
    $scope.assetsLoaded = 0;

    $scope.isShareView = $scope.location.path() !== '/' && $scope.location.path().indexOf('playlist') === -1 && $scope.location.path().indexOf('listen') === -1 && $scope.location.path().indexOf('search') === -1;

    
    /*************** run when loaded ***************/
    StopClicksService.disableClicks();

    var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

    var guid = function () {
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };

    UserService.verifyUser();
    $scope.isLogged = function() {
      return UserService.isLogged();
    };


    //ngProgress is the top loading bar shown when first loading the page
    ngProgress.color('#2d9');
    ngProgress.start();

    /*
      ========== $scope.search ==========
      Gets called when user clicks or hits enter on the search bar/button

      Params:
        userInput
          - Whathever is currently on the search box (inside form #search)
    */
    $scope.search = function(userInput) {
      //Call SearchService for each of the services
      $scope.userInput = ""; // clearing the input box
      $scope.searching = true;

      if(isUrl(userInput)) {
        if(userInput.indexOf("youtu") !== -1) {
          ParseService.youtube(userInput);
        }
        else if(userInput.indexOf("soundcloud") !== -1) {
          ParseService.soundcloud(userInput);
        }
        else if(userInput.indexOf("deezer") !== -1) {

        }
        else if(userInput.indexOf("spotify") !== -1) {
          ParseService.spotify(userInput);
        }
        else if (userInput.indexOf("rdio") !== -1) {
          ParseService.rdio(userInput);
        }
        $scope.searching = false;
      } else {
        // SearchService.rdio(userInput);

        var youtube = [];
        var rdio = [];
        var soundcloud = [];

        $q.all([
          SearchService.rdio(userInput),
          SearchService.youtube(userInput),
          SearchService.soundcloud(userInput)
        ])
        .then(function(results) {
          results.forEach(function(result) {
            SearchService.searchResults = SearchService.searchResults.concat(result);
          });
          $scope.searching = false;
        });
        // SearchService.deezer(userInput);  also needs to be refactored in the service to use promises
      }
      $location.path('/search');
    };

    var isUrl = function isUrl(s) {
      var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return regexp.test(s);
    };

    /* Share Button: when clicked, share button do a post request to /queues */
    $scope.share = function() {
      QueueService.saveQueue($scope.searchResults);
    };


    $scope.login = function() {
      if(UserService.user.loggedIn) {
        $http({ method: 'GET', url: '/logout/' + UserService.user.username})
        .success(function(){
          UserService.logout();
        })
        .error(function(){
          console.log("error logging out");
        });
      } else {
        OAuth.popup('facebook', { state: $cookies['ammoio.sid'] }, function(err, res) {
          if(err) {
            console.log(err);
            return;
          }
          console.log(res);
          $http({ method: 'POST', url: '/login', data: { code: res.code }})
            .success(function(userObj) {
              UserService.setUser(userObj);
              UserService.setLogged(true);

              $http.get("/" + userObj.username + "/playlists")
                .success(function(playlists) {
                  UserService.user.playlists = playlists;
              });
            })
            .error(function(err){
              console.log(err);
            });
        });
      }
    };




    /*
      ======== saveToPlaylist ========
      Save the current queue to a playlist.
    */
    $scope.saveToPlaylist = function(name) {
      if(!UserService.user.loggedIn) {
        console.log("Can't save playlist if user is not logged.");
        return;
      }

      if(!name) {
        console.log("Playlist name can not be empty");
        return;
      }

      var playlistObj = {
        name: name,
        songs: [] 
      };

      $http({ method: 'POST', url: '/' + UserService.user.username + '/playlists', data: playlistObj })
      .success(function(data) {
        console.log("Saved successfully");
        UserService.user.playlists.push(data);
      })
      .error(function() {
        console.log("Error saving playlist");
      });

      $scope.playlistName = "";
      $scope.showPlaylistInput = false;
    };

    /*************** $scope functions ***************/

    /*
      ========== $scope.shareRequestModal ==========
      -Called when shareRequestModal is filled out and "Share" is clicked. When modal is submitted
    */
    $scope.shareRequestModal = function() {
      QueueService.saveQueue($scope.queueName)
      .then(function(queue) {
        $('#shareResponseModal').addClass('md-show'); //show response modal
      });
    };

    /* ========== $scope.closeModal ==========
      hide all the modals
    */
    $scope.closeModal = function (selector){
      $('.md-show').removeClass('md-show');
    };

    /* ========== $scope.stopLoadingBar ==========
      In charge of stoping the top Loading Bar when all the players are loaded
      Params:
        asset: string with the name of the service player which is now ready
    */
    $scope.stopLoadingBar = function (asset) {
      $scope.assetsLoaded++;
      if($scope.assetsLoaded === 2) {
        ngProgress.complete();
        StopClicksService.enableClicks(); //enable clicking again
      }
    };

    /* ========== $scope.changePlaylist ==========
      Redirects user to /playlist/:id who then will display the tracks of that playlist

      Params:
        playlist: playlist object getting passed when a user clicks to a playlist name on the sidebar
    */
    $scope.changePlaylist = function(playlist) {
      $location.path('/playlist/' + playlist.shareId);
    };

    /* ========== $scope.togglePlaylistInput ==========
      toggle the playlist input box when clicked
    */
    $scope.togglePlaylistInput = function(){
      $scope.showPlaylistInput = !$scope.showPlaylistInput;
    };

    /* ========== $scope.setSongToAdd ==========
      Used so that the dropdown has access to specific songs to add to q's and playlists
    */
    $scope.setSongToAdd = function(song, $index){
      if ($index !== undefined){
        $scope.clickedIndex = $index;
      }
      $scope.songToAdd = song;
    };

    /* ========== $scope.showQueue ==========
      Redirects the user to /listen to load the queue
    */
    $scope.showQueue = function() {
      if (QueueService.live) {
        $location.path('/listen/' + QueueService.queue.listenId);
      } else {
        $location.path('/listen/');
      }
    };

    /* ========== $scope.fixTime ==========
      format the time from seconds for display
    */    
    $scope.fixTime = function(seconds) {
      var mins = seconds / 60 | 0; 
      seconds = seconds % 60 | 0;
      if(seconds < 10) {
        return mins + ":0" + seconds;
      } else {
        return mins + ":" + seconds;
      }
    };

  });

