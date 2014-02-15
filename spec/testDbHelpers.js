// var request = require('request');
var dbHelpers = require('../dbHelpers.js');

var queue = {
  name: "New Queue",
  passphrase: "secret",
  songs: [{
    url: "http://youtube.com/watch?v=38942hghg",
    service: "youtube",
    serviceId: "38942hghg",
    title: "Back in Black - Live...",
    artist: null, //Optional param
    duration: 180 //in Seconds
  },{
    url: "http://youtube.com/watch?v=7843729abc",
    service: "youtube",
    serviceId: "7843729abc",
    title: "Sweet Home Alabama ... Awesome Remix...",
    artist: null, //Optional param
    duration: 212 //in Seconds
  }],
  currentSong: 1
};

var playlist = {
  name: "Badass Mix",
  songs: [{
    url: "http://youtube.com/watch?v=38942hghg",
    service: "youtube",
    serviceId: "38942hghg",
    title: "Back in Black - Live...",
    artist: null, //Optional param
    duration: 180 //in Seconds
  },{
    url: "http://youtube.com/watch?v=7843729abc",
    service: "youtube",
    serviceId: "7843729abc",
    title: "Sweet Home Alabama ... Awesome Remix...",
    artist: null, //Optional param
    duration: 212 //in Seconds
  }]
};

dbHelpers.createQueue(queue).then(function(data){
  dbHelpers.getQueue(data.shareId).then(function(newData){
    console.log("Should Create and Get Queues successfully: ", data.shareId === newData.shareId);
    dbHelpers.updateQueue(newData.shareId, {name: "Alex's Queue", songs: [{alex: "t"}, {Taylor: 'a'}]}).then(function(updatedData){
      console.log("Should update queues successfully: ", updatedData.name === "Alex's Queue");
      console.dir(updatedData);
    });
  });
});

var user = {
  username: "alex"
};

dbHelpers.createUser(user).then(function(user){
  console.log("Successfully Created: ", user);

  dbHelpers.createPlaylist(user.username, playlist).then(function(playlist){
    console.log("Created Playlist: ", playlist);
    dbHelpers.addSongToPlaylist('alex', playlist.id, {title: "Baby got Back", duration: 119}).then(function(song){
      console.log("Song added to playlist: ", song);
    }).fail(function(err){
      console.log("Error adding song to playlist: ", err);
    });
  }).fail(function(err){
    console.log("Failed to Create Playlist: ", err);
  });


}).fail(function(err){
  console.log("Err creating user: ", err);
});






