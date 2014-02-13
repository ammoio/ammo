// var request = require('request');
var dbHelpers = require('../dbHelpers.js');

dbHelpers.createQueue({
  name: "New Queue",
  passphrase: "secret",
  songs: [{},{},{}],
  currentSong: 0
}).then(function(data){
  console.log(data);
});

