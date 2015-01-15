/**
* Playlist.js
*/

module.exports = {

  attributes: {
    name: {
      type: 'string',
      size: 50
    },
    permissions: {
      type: 'string',
      defaultsTo: 'public'
    },

    owner: {
      model: 'user'
    },
    songs: {
      collection: 'song',
      via: 'playlists'
    }
  }
};
