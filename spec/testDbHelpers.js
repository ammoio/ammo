// var request = require('request');
var dbHelpers = require('../dbHelpers.js');

var queue = {
  name: "New Queue",
  passphrase: "secret",
  songs: [{},{},{}],
  currentSong: 0
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
  username: "alex",
  playlists: []
};

dbHelpers.createUser(user).then(function(user){
  console.log("Successfully Created: ", user);
}).fail(function(err){
  console.log("Err creating user: ", err);
});




