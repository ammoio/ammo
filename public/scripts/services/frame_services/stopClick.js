angular.module('ammoApp')
.service('StopClicksService', function() {

  //disable any clicking before all of the music players are loaded successfully
  this.disableClicksFunction = function(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  this.disableClicks = function() {
    document.addEventListener("click", this.disableClicksFunction, true);
    $('body').css('cursor', 'wait');
  };

  this.enableClicks = function() {
    document.removeEventListener("click", this.disableClicksFunction, true);
    $('body').css('cursor', 'auto');
  };

});