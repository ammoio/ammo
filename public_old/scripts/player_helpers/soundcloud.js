SC.initialize({
  client_id: "456165005356d6638c4eabfc515d11aa"
});

var scPlayer;

SC.stream("/tracks/293", function (sound) {
  scPlayer = sound;
});

// We need to repeat the var scope because scope() doesn't exist when loaded.
var scPlay = function (track) {
  SC.stream("/tracks/" + track, {
    autoPlay: true,
    onfinish: function () {
      var scope = angular.element(document.getElementById("youtube")).scope();
      scope.playNext();
      scope.$apply();
    },
    onplay: function () {
      var scope = angular.element(document.getElementById("youtube")).scope();
      scope.ready = true;
    },
    onbufferchange: function () {
      var scope = angular.element(document.getElementById("youtube")).scope();
      if (this.isBuffering) {
        scope.buffering = true;
      } else {
        scope.buffering = false;
      }
    }
  }, function (sound) {
    scPlayer = sound;
  });
};