/*
 *Queue
 *
 *Queues are live playlists, they contain metadata pertaining to the 
 *current state of the queue such as song. These are not associated
 *with any user and are completely public.
 *
*/

var Queue = {
  name: String,
  shareId: String,
  passphrase: String,
  lastAccessed: Date,
  songs: Array,
  currentSong: Number
};

/*
 *Playlist
 *
 *Playlists are simple song lists. They simply provide a way for users to save lists
  of songs. You can create a playlist from a queue or turn a queue into a playlist.
 *
*/

var Playlist = {
  name: String,
  id: String,
  songs: Array
};

/*
 *Song
 *
 *Songs can have many different proprities depending on the service, but should include the following
 *
*/

var Song = {
  url: String,
  service: String,
  service_id: String,
  title: String,
  artist: String,
  duration: Number (seconds),
  image: String
};
