// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var youtube;

var onYouTubeIframeAPIReady = function () {
  youtube = new YT.Player('youtube', {
    height: '200',
    width: '288',
    videoId: '',
    playerVars: { 'controls': 0, 'iv_load_policy': 3, 'disablekb': 1, 'modestbranding': 1, 'rel': 0, 'showinfo': 0 },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

var onPlayerReady = function () {

  var scope = angular.element(document.getElementById("search")).scope();
  scope.stopLoadingBar("YouTube");
};

var onPlayerStateChange = function (event) {
  var scope = angular.element(document.getElementById("youtube")).scope();

  if (event.data === YT.PlayerState.ENDED) {
    scope.playNext();
    scope.$apply();
  } else if (event.data === YT.PlayerState.BUFFERING) {
    scope.buffering = true;
  } else if (event.data === YT.PlayerState.PLAYING) {
    scope.buffering = false;
    scope.ready = true;
    scope.unPause();
  } else if (event.data === YT.PlayerState.PAUSED) {
    scope.detectManualPause();
  }
};

var onYouTubeIframeAPIReady = function () {
  youtube = new YT.Player('youtube', {
    height: '0',
    width: '0',
    videoId: '',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};

var stopVideo = function () {
  youtube.stopVideo();
};
