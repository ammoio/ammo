/**
* User.js
*/

module.exports = {
  autoPk: false,

  attributes: {
    username: {
      type: 'string',
      unique: true
    },
    firstName: 'string',
    lastName: 'string',
    fullName: 'string',
    email: {
      type: 'string',
      unique: true,
      protected: true,
      email: true
    },
    facebookId: 'string',

    playlists: {
      collection: 'playlist',
      via: 'owner'
    }
  }
};
