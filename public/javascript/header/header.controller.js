(function() {
  'use strict';

  angular
    .module('ammo.header.controller', [])
    .controller('HeaderController', HeaderController);

  function HeaderController($auth, $http) {
    var Ctrl = this;

    Ctrl.authenticate = function(provider) {
      $auth.authenticate(provider);
    };

    Ctrl.logout = function() {
      $auth.logout();
    };

    // All this should be moved to a user controller
    // and use restangular
    Ctrl.me = function() {
      $http.get('/api/v1/me')
        .then(function(response) {
          console.log(response.data);
        })
        .catch(function(err) {
        console.log(err);
      });
    };
  }
})();
