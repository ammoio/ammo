R.ready(function () {

  var playerScope = angular.element(document.getElementById("youtube")).scope();
  var frameScope = angular.element(document.getElementById("search")).scope();
  var lastPosition = false;
  frameScope.stopLoadingBar("Rdio");

  // console.log("Can Stream? ", R.currentUser.get('canStreamHere'));

  R.player.on('change:playState', function (state) {
    if (state === 1) { // 1 is playing. before buffer it is 2
      playerScope.buffering = false;
      playerScope.ready = true;
    } else if (state === 2) {
      playerScope.buffering = true;
    }
  });

  R.player.on('change:position', function (position) {
    if (position === 0 && lastPosition && !playerScope.buffering) {
      lastPosition = false;
      playerScope.playNext();
      playerScope.$apply();
    }
    lastPosition = position;
  });
});