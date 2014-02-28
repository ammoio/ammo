angular.module('ammoApp')
  .controller('FrameController', function($q, $scope, $http, $location, $cookies, ParseService, SearchService, UserService, QueueService) {
  
    /*************** scope variables ***************/
    $scope.UserService = UserService;
    $scope.QueueService = QueueService;
    $scope.location = $location;
    $scope.isShareView = $scope.location.path().indexOf('playlist') === -1 && $scope.location.path().indexOf('listen') === -1;
    $scope.isMobile = window.innerWidth <= 800 && window.innerHeight <= 600;
    $scope.socket = io.connect($scope.location.host()); //initializing socket

    /*************** $scope functions ***************/

    /*
      ========== $scope.search ==========
      Gets called when user clicks or hits enter on the search bar/button
      Checks if the input is a url. If so, parse url in ParseService, else call SearchService
      to search each API
    */
    $scope.search = function(userInput) {
      //Call SearchService for each of the services
      $scope.userInput = ""; // clearing the input box
      $scope.searching = true;

      if(isUrl(userInput)) {
        ParseService.parseURL(userInput);
        $scope.searching = false;
      } else {
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
      }
      $location.path('/search');
    };
    
    //$scope.search helper
    var isUrl = function isUrl(s) {
      var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return regexp.test(s);
    };

    /* Share Button: when clicked, share button do a post request to /queues */
    $scope.share = function() {
      QueueService.saveQueue($scope.searchResults);
    };

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


    /* ========== $scope.showQueue ==========
      Redirects the user to /listen to load the queue
    */
    $scope.showQueue = function() {
      $location.path('/listen');
    };

    
    /* ========== $scope.closeModal ==========
      hide all the modals
    */
    $scope.closeModal = function (selector){
      $('.md-show').removeClass('md-show');
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