var mongoose = require('mongoose');


/*
 *Queue
 *
 *Queues are live playlists, they contain metadata pertaining to the
 *current state of the queue such as song. These are not associated
 *with any user and are completely public.
 *
*/
var queueSchema = mongoose.Schema({
  name: String,
  shareId: String,
  listenId: String,
  passphrase: String,
  lastAccessed: Date,
  songs: {type: [], default: []},
  currentSong: Number,
  isPrivate: {type: Boolean, default: false},
  username: {type: String, default: null}
});

/*
 *User
 *
 *Users contain playlists
 *
*/
var userSchema = mongoose.Schema({
  username: String,
  sessionId: {type: String, default: null},
  email: String,
  name: String,
  playlists: {type: [], default: []}
});


/*
 *Playlist
 *
 *Playlists are simple song lists. They simply provide a way for users to save lists
  of songs. You can create a playlist from a queue or turn a queue into a playlist.
 *
*/
var playlistSchema = mongoose.Schema({
  name: String,
  id: String,
  songs: []
});


/*
 *Song
 *
 *Songs can have many different proprities depending on the service, but should include the following
 *This is currently not implemented.
*/
var songSchema = mongoose.Schema({
  url: String,
  service: String,
  serviceId: String,
  title: String,
  artist: String,
  duration: Number, //in seconds
  image: String
});

module.exports = {
  Queue: mongoose.model('Queue', queueSchema),
  // Playlist: mongoose.model('Playlist', playlistSchema),
  User: mongoose.model('User', userSchema)
};
