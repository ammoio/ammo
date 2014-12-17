/**
* Song.js
*/

module.exports = {

  attributes: {
    id: {
      type: 'string',
      primaryKey: true
    },
    artist: 'string',
    title: 'string',
    duration: 'integer',
    service: 'string',
    url: 'string',
    image: 'string',

    playlists: {
      collection: 'playlist',
      via: 'songs'
    }
  }
};
