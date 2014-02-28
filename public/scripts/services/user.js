angular.module('ammoApp')

  .service('UserService', function($http) {
    this.user = {
      username: null,
      name: null,
      email: null,
      loggedIn: false,
      playlists: null
    };

    this.setUser = function(userObj) {
      this.user = userObj;
    };

    this.setLogged = function(status) {
      this.user.loggedIn = status;
    };

    this.isLogged = function() {
      return this.user.loggedIn;
    };

    this.logout = function() {
      this.user.username = null;
      this.user.name = null;
      this.user.email = null;
      this.user.loggedIn = false;
      this.user.playlists = null;
    };

    this.verifyUser = function() {
      $http({ method: 'GET', url: '/user'})
      .success(function(user) {
        this.setUser(user);
        this.setLogged(true);
      })
      .error(function(err) {
        console.log(err);
      });
    };
  });
