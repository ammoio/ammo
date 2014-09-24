var onPlayerLoaded = function() {
  var frameScope = angular.element(document.getElementById("search")).scope();
  var playerScope = angular.element(document.getElementById("youtube")).scope();

  frameScope.stopLoadingBar("Deezer");
  var currentPosition = 0;
  var currentDuration = 0;

  DZ.Event.subscribe('player_play', function(){
    playerScope.buffering = false;
    playerScope.ready = true;
  });

  DZ.Event.subscribe('player_buffering', function(bufferPosition) {
    if((currentPosition * playerScope.currentSong.duration / 100) | 0 > bufferPosition) {
      playerScope.buffering = true;
    }
      playerScope.buffering = false;
  });


  DZ.Event.subscribe('player_position', function(args) {
    // currentTime = args[0]
    // duration = args[1]
    if(args[0] === 0 && DZ.player.isPlaying()) {
      DZ.player.pause();
      playerScope.playNext();
      playerScope.$apply();
    }

    currentPosition = args[0];
    currentDuration = args[1];
  });
};

// Loading Deezer sdk async
window.dzAsyncInit = function() {
  DZ.init({
    appId  : '132563',
    channelUrl : 'http://developers.deezer.com/examples/channel.php', // Change this
    player : {
      onload : onPlayerLoaded
    }
  });
};
(function() {
  var e = document.createElement('script');
  e.src = 'http://cdn-files.deezer.com/js/min/dz.js';
  e.async = true;
  document.getElementById('dz-root').appendChild(e);
}());