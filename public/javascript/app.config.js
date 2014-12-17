(function() {
  'use strict';

  angular
    .module('ammo.config', ['restangular'])
    .config(appConfig);

  function appConfig($authProvider, $locationProvider, RestangularProvider) {
    // Enabling html5 pushstate
    $locationProvider.html5Mode(true);

    // Satellizer provider
    $authProvider.facebook({
      clientId: '295545623927393'
    });

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
