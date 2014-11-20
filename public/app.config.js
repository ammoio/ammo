(function() {
  'use strict';

  angular
    .module('ammo.config', ['restangular'])
    .config(appConfig);

  function appConfig(RestangularProvider) {
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
