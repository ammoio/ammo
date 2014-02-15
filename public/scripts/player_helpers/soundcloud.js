SC.initialize({
 client_id: "456165005356d6638c4eabfc515d11aa"
});

var scPlayer;

SC.stream("/tracks/293", function(sound){
  scPlayer = sound;
});

var scPlay = function(track) {
  SC.stream("/tracks/" + track, {
    autoPlay: true,
    onfinish: function() { 
      var scope = angular.element(document.getElementById("youtube")).scope();
      scope.playNext();
      scope.$apply();
    },
  }, function(sound) {
    scPlayer = sound;
  });
};