angular.module('ammoApp')
.service('StopClicksService', function() {

  //disable any clicking before all of the music players are loaded successfully
  this.disableClicks = function() {
    this.clickListener =  document.addEventListener("click", function(e){
      e.stopPropagation();
      e.preventDefault();
    },true);
    $('body').css('cursor', 'wait');
  };

  this.enableClicks = function() {
    document.removeEventListener("click", this.clickListener, true);
  };

});