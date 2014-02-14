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
    console.log("Testing Create and Get Queue functions (should match): ", newdata, data);
    dbHelpers.updateQueue(newData.shareId, {name: "Alex's Queue"}).then(function(updatedData){
      console.log("Should update queues successfully: ", updatedData.name === "Alex's Queue");
    });
  });
});

