angular.module('ammoApp')

  .service('UserService', function($http) {
    var user = {
      username: null,
      name: null,
      email: null,
      logged_in: false
    };

    this.setUser = function(userObj) {
      user = userObj;
    };

    this.setLogged = function(status) {
      user.logged_in = status;
    };

    this.isLogged = function() {
      return user.logged_in;
    };

    this.logout = function() {
      user.username = null;
      user.name = null;
      user.email = null;
      user.logged_in = false;
    };
  });
