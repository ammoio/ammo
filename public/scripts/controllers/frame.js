angular.module('ammoApp') 
  .controller('FrameController', function($scope, $http, ParseService, $location, SearchService, QueueService) {

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

  });