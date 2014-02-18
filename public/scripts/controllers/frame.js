angular.module('ammoApp') 
  .controller('FrameController', function($scope, $http, $location, ParseService, SearchService, QueueService, ngProgress) {
    $scope.QueueService = QueueService;

    //ngProgress is the top loading bar shown when first loading the page
    ngProgress.color('#2d9');
    ngProgress.start();

    // This variable is used to know when youtube 
    // and deezer are loaded ($scope.stopLoadingBar())
    $scope.assetsLoaded = 0; 

    /* 
      ========== $scope.search ==========
      Gets called when user clicks or hits enter on the search bar/button

      Params: 
        userInput
          - Whathever is currently on the search box (inside form #search)
    */
    $scope.search = function(userInput) {
      //Call SearchService for each of the services and pass pushResults as a callback 
      $scope.userInput = ""; // clearing the input box

      if(isUrl(userInput)) {
        if(userInput.indexOf("youtu") !== -1) {
          ParseService.youtube(userInput);
        }
        else if(userInput.indexOf("soundcloud") !== -1) {
          ParseService.soundcloud(userInput);
        }
        else if(userInput.indexOf("deezer") !== -1) {

        }
      } else {
        SearchService.youtube(userInput);
        SearchService.soundcloud(userInput); 
        // SearchService.deezer(userInput);
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

    //  OAuth.popup('facebook', function(err, res) {
    //   if(err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log(res);
    //   $http.get('https://graph.facebook.com/me?access_token=' + res.access_token)
    //   .then(function (resp) {
    //     console.log(resp);
    //   });
    // });


        /*
      ========== shareRequestModal ==========
      -Called when shareRequestModal is filled out and "Share" is clicked. When modal is submitted, trigger QueueService.saveQueue with those inputs.

      Params:
        None

      Return: No return
    */
    $scope.shareRequestModal = function() {
      QueueService.saveQueue($scope.queueName, $scope.passphrase)
      .then(function(queue) {
        $('#shareResponseModal').modal(); //show response modal
      });
    };

    $scope.stopLoadingBar = function () {
      $scope.assetsLoaded++;
      if($scope.assetsLoaded === 2) {
        ngProgress.complete();
      }
    };
  });