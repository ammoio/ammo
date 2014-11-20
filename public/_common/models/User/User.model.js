(function() {
  'use strict';

  angular
    .module('ammo.User.model', ['restangular'])
    .factory('User', userModel);

  function userModel(Restangular) {
    var service = Restangular.service('users');

    return service;
  }
})();