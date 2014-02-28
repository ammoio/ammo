angular.module('ammoApp')

  .service('UserService', function($http, $cookies) {
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

    this.login = function() {
      if(this.user.loggedIn) {
        $http({ method: 'GET', url: '/logout/' + this.user.username})
        .success(function(){
          this.logout();
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
          $http({ 
            method: 'POST', 
            url: '/login', 
            data: { code: res.code }
          })
          .success(function(userObj) {
            this.setUser(userObj);
            this.setLogged(true);

            $http.get("/" + userObj.username + "/playlists")
            .success(function(playlists) {
              this.user.playlists = playlists;
            });
          })
          .error(function(err){
            console.log(err);
          });
        });
      }
    };

  });
