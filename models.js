var mongoose = require('mongoose');

var queueSchema = mongoose.Schema({
  name: String,
  shareId: String,
  passphrase: String,
  lastAccessed: Date,
  songs: [],
  currentSong: Number
});

var playlistSchema = mongoose.Schema({
  name: String,
  songs: [] 
});

var songSchema = mongoose.Schema({
  url: String,
  service: String,
  service_id: String,
  title: String,
  artist: String,
  duration: Number (seconds)
});

module.exports = {
  Queue = mongoose.model('Queue', queueSchema),
  Playlist = mongoose.model('Queue', playlistSchema)
};
