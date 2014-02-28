angular.module('ammoApp')
.service('StopClicksService', function() {

  //disable any clicking before all of the music players are loaded successfully
  var disableClicksFunction = function(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  this.disableClicks = function() {
    document.addEventListener("click", disableClicksFunction, true);
    $('body').css('cursor', 'wait');
  };

  this.enableClicks = function() {
    document.removeEventListener("click", disableClicksFunction, true);
    $('body').css('cursor', 'auto');
  };
});