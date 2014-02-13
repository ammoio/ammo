/*
*Queues
*
*Queues are live playlists, they contain metadata pertaining to the 
*current state of the queue such as song. These are not associated
*with any user and are completely public.
*
*/

var Queue = {
  name: String,
  shareId: String,
  lastAccessed: Date,
  songs: Array,
  currentSong: Number,

  
};
