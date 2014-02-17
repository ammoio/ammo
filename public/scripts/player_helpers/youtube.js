// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var youtube;

function onYouTubeIframeAPIReady() {
  youtube = new YT.Player('youtube', {
    height: '0',
    width: '0',
    videoId: '',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  var scope = angular.element(document.getElementById("search")).scope();
  scope.stopLoadingBar();
}

function onPlayerStateChange(event) {
  var scope = angular.element(document.getElementById("youtube")).scope();

  if(event.data === YT.PlayerState.ENDED) {
    scope.playNext();
    scope.$apply();
  }
  else if(event.data === YT.PlayerState.BUFFERING) {
    scope.buffering = true; 
  }
  else if(event.data === YT.PlayerState.PLAYING) {
    scope.buffering = false;
    scope.ready = true;
  }
  else if(event.data === YT.PlayerState.PAUSED) {
    scope.detectYoutubeAd();
  }
}

// fun function xD
function stopVideo() {
  youtube.stopVideo();
}