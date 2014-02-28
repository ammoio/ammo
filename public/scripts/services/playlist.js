angular.module('ammoApp')
  .service('PlaylistService', ['$http', 'UserService', '$q', function ($http, UserService, $q) {
    var postPlaylist = function (name) {
      var d = $q.defer();

      var playlistObj = {
        name: name,
        songs: []
      };
      $http({ method: 'POST', url: '/' + UserService.user.username + '/playlists', data: playlistObj })
        .success(function (data) {
          UserService.user.playlists.push(data);
          d.resolve(data);
        })
        .error(function () {
          console.log("Error saving playlist");
          d.reject();
        });

      return d.promise;
    };

    this.saveToPlaylist = function (name) {
      var d = $q.defer();

      if (!UserService.user.loggedIn) {
        alert("Can't save playlist. Please log in with Facebook");
        return;
      }

      if (!name) {
        alert("Playlist name can not be empty");
        return;
      }
      postPlaylist(name)
        .then(function (playlist) {
          d.resolve(playlist);
        })
        .catch(function (err) {
          d.reject(err);
        });

      return d.promise;
    };
  }]);