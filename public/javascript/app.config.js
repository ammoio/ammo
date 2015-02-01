(function() {
  'use strict';

  angular
    .module('ammo.config', [
      'ammo.authInterceptor.service',
      'restangular'
    ])
    .config(appConfig);

  function appConfig($authProvider, $locationProvider, $httpProvider, RestangularProvider) {
    // Enabling html5 pushstate
    $locationProvider.html5Mode(true);

    // Satellizer provider
    $authProvider.facebook({
      clientId: '295545623927393'
    });
    $authProvider.httpInterceptor = false;
    $httpProvider.interceptors.push('authInterceptor');

    RestangularProvider.addResponseInterceptor(responseInterceptor);
    RestangularProvider.addRequestInterceptor(requestInterceptor);

    function responseInterceptor(data, operation, what, url) {
      var extractedData;

      extractedData = data[what];
      extractedData.links = data.links;

      return extractedData;
    }

    function requestInterceptor(element, operation, what, url) {
      var formattedElement = {};

      formattedElement[what] = [element];

      return formattedElement;
    }
  }
})();
