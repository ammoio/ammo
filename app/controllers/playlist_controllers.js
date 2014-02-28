var loginHelpers = require('../loginHelpers');
var User = require('../models/user_model');
var Queue = require('../models/queue_model');

/* ======== Playlist Controllers ========*/

module.exports = {

  getUserPlaylists: function(req, res){
    User.getPlaylists(req.params.user)
    .then(function(playlists){
      res.send(playlists);
    })
    .fail(function (err) {
      res.send(500, err);
    });
  },

  create: function(req, res){
    loginHelpers.validateSession(req.params.user, req.cookies['ammoio.sid'])
    .then(function (response) {
      console.log("Valid Session", req.params.user);
      return true;
    })
    .then(function () {
      return User.createPlaylist(req.params.user, req.body);
    })
    .then(function(playlist){
      res.send(playlist);
    })
    .fail(function (err) {
      if(err === "not logged in"){
        res.send(401);
      } else {
        res.send(500, err);
      }
    });
  }

};
