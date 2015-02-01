(function() {
  'use strict';

  angular
    .module('ammo.authInterceptor.service', [])
    .factory('authInterceptor', authInterceptor);

  function authInterceptor($q) {
    var tokenName = 'satellizer_token';

    return {
      request: function(httpConfig) {
        var regexp = /^\/api\/.*/,
            token;

        if (httpConfig.url.match(regexp)) {
          token = localStorage.getItem(tokenName);

          if (token) {
            httpConfig.headers.Authorization = 'Bearer ' + token;
          }
        }
        return httpConfig;
      },
      responseError: function(response) {
        return $q.reject(response);
      }
    };
  }
}());
