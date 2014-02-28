angular.module('ammoApp')
.service('PlaylistService', ['$http', 'UserService', function($http, UserService) {
  this.saveToPlaylist = function(name) {
    if(!UserService.user.loggedIn) {
      alert("Can't save playlist. Please log in with Facebook");
      return;
    }

    if(!name) {
      alert("Playlist name can not be empty");
      return;
    }
    postPlaylist(name);
  };

  var postPlaylist = function(name) {
    var playlistObj = {
      name: name,
      songs: [] 
    };
    $http({ method: 'POST', url: '/' + UserService.user.username + '/playlists', data: playlistObj })
    .success(function(data) {
      UserService.user.playlists.push(data);
    })
    .error(function() {
      console.log("Error saving playlist");
    });
  };
}]);