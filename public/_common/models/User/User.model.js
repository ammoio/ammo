(function() {
  'use strict';

  angular
    .module('ammo.User.model', ['restangular'])
    .factory('User', userModel);

  function userModel(Restangular) {
    var model = Restangular.service('users');

    return model;
  }
})();
