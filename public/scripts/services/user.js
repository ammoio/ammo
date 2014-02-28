angular.module('ammoApp')

  .service('UserService', function ($http, $cookies, $q) {
    this.user = {
      username: null,
      name: null,
      email: null,
      loggedIn: false,
      playlists: null
    };

    this.setUser = function (userObj) {
      this.user = userObj;
    };

    this.setLogged = function (status) {
      this.user.loggedIn = status;
    };

    this.isLogged = function () {
      return this.user.loggedIn;
    };

    this.logout = function () {
      this.user.username = null;
      this.user.name = null;
      this.user.email = null;
      this.user.loggedIn = false;
      this.user.playlists = null;
    };

    this.verifyUser = function () {
      var that = this;
      $http({ method: 'GET', url: '/user'})
        .success(function (user) {
          that.setUser(user);
          that.setLogged(true);
        })
        .error(function (err) {
          console.log(err);
        });
    };

    this.login = function () {
      var that = this;
      if (this.user.loggedIn) {
        that.logOutRequest();
      } else {
        OAuth.popup('facebook', { state: $cookies['ammoio.sid'] }, function (err, res) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(res);
          that.userQuery(res); //use fb code to query database for this user
        });
      }
    };

    /* login helpers */
    this.logOutRequest = function () {
      var that = this;
      $http({ method: 'GET', url: '/logout/' + that.user.username})
        .success(function () {
          that.logout();
        })
        .error(function () {
          console.log("error logging out");
        });
    };
    this.userQuery = function (res) {
      var that = this;
      // POST to /login with Facebook response code
      $http({
        method: 'POST',
        url: '/login',
        data: { code: res.code }
      })
        // set the user on success
        .success(function (userObj) {
          that.setUser(userObj);
          that.setLogged(true);
          that.getUserPlaylists(userObj);
        })
        .error(function (err) {
          console.log(err);
        });
    };

    this.getUserPlaylists = function (userObj) {
      var d = $q.defer();
      var that = this;
      $http.get("/" + userObj.username + "/playlists")
        .success(function (playlists) {
          that.user.playlists = playlists;
          d.resolve(playlists);
        })
        .error(function (err) {
          d.reject(err);
        });

      return d.promise;
    };

  });
