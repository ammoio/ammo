angular.module('ammoApp') 
  .controller('FrameController', function($scope, $http, $location, ParseService, SearchService, QueueService) {
    $scope.QueueService = QueueService;
    /* 
      ========== $scope.search ==========
      Gets called when user clicks or hits enter on the search bar/button

      Params: 
        userInput
          - Whathever is currently on the search box (inside form #search)
    */
    $scope.search = function(userInput) {
      //Call SearchService for each of the services and pass pushResults as a callback 
      SearchService.youtube(userInput);
      SearchService.soundcloud(userInput); 
      $location.path('/search');
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
        $('.twitter-share-button').attr({
          'data-url': $location.host + $scope.QueueService.queue.shareId,
          'data-text': "Hey, checkout this playlist I made!\n"
        }); //dynamically set the url
      });
    };

  });