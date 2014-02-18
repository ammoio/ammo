// a global variable that will hold a reference to the api swf once it has loaded
var apiswf = null;
var rdio = {};

$(document).ready(function() {
  // on page load use SWFObject to load the API swf into div#apiswf
  var flashvars = {
    'playbackToken': "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=",
    'domain': "localhost", // Change domain and playbackToken when not in localhost
    'listener': 'callback_object'    // the global name of the object that will receive callbacks from the SWF
  };

  var params = {
    'allowScriptAccess': 'always'
  };

  var attributes = {};

  swfobject.embedSWF('http://www.rdio.com/api/swf/', // the location of the Rdio Playback API SWF
      'apiswf', // the ID of the element that will be replaced with the SWF
      1, 1, '9.0.0', 'expressInstall.swf', flashvars, params, attributes);


  rdio.play = function(song) {
    apiswf.rdio_play(song);
  };

  rdio.pause = function() {
    apiswf.rdio_play();
  };
});


// the global callback object
var callback_object = {};

callback_object.ready = function ready(user) {
  // Called once the API SWF has loaded and is ready to accept method calls.
  var playerScope = angular.element(document.getElementById("youtube")).scope();
  var frameScope = angular.element(document.getElementById("search")).scope();
  frameScope.stopLoadingBar();


  // find the embed/object element
  apiswf = $('#apiswf').get(0);

  // if (user === null) {
  //   console.log("User not logged in.");
  // } else if (user.isSubscriber) {
  //   console.log("User type: Subscriber");
  // } else if (user.isTrial) {
  //   console.log("User type: Trial");
  // } else if (user.isFree) {
  //   console.log("User type: Free");
  // } else {
  //   console.log("User not logged in.");
  // }
};

callback_object.freeRemainingChanged = function freeRemainingChanged(remaining) {
  // A free user has limited songs per day/month? we catch that here
};

callback_object.playStateChanged = function playStateChanged(playState) {
  // The playback state has changed.
  // The state can be: 0 - paused, 1 - playing, 2 - stopped, 3 - buffering or 4 - paused.
  if(playState === 3) {
    playerScope.buffering = true;
  } else {
    playerScope.buffering = false;
  }
};

callback_object.playingTrackChanged = function playingTrackChanged(playingTrack, sourcePosition) {
  // The currently playing track has changed.
  // Track metadata is provided as playingTrack and the position within the playing source as sourcePosition.
  if (playingTrack !== null) {

  }
};

callback_object.playingSourceChanged = function playingSourceChanged(playingSource) {
  // The currently playing source changed.
  // The source metadata, including a track listing is inside playingSource.
};

callback_object.volumeChanged = function volumeChanged(volume) {
  // The volume changed to volume, a number between 0 and 1.
};

callback_object.muteChanged = function muteChanged(mute) {
  // Mute was changed. mute will either be true (for muting enabled) or false (for muting disabled).
};

callback_object.positionChanged = function positionChanged(position) {
  //The position within the track changed to position seconds.
  // This happens both in response to a seek and during playback.
  $('#position').text(position);
};

callback_object.playingSomewhereElse = function playingSomewhereElse() {
  // An Rdio user can only play from one location at a time.
  // If playback begins somewhere else then playback will stop and this callback will be called.
};