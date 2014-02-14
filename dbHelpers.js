/*
 * Database Helper Functions
*/

var mongoose = require('mongoose');
var Q = require('q');
var crypto = require('crypto'); 
var Models = require('./models');

mongoose.connect('mongodb://localhost/ammo');

module.exports = {

/* ======== Queue Helpers ======== */
  getQueues: function(){
    var d = Q.defer();
    Models.Queue.find(function(err, data){
      if(err){
        d.reject(err);
      } else {
        d.resolve(data);
      }
    });
    return d.promise;
  },

  getQueue: function(id){
    var d = Q.defer();
    Models.Queue.findOne({shareId: id}, function(err, data){
      if(err){
        d.reject(err);
      } else {
        d.resolve(data);
      }
    });
    return d.promise;
  },

  createQueue: function(obj){
    var d = Q.defer();
    obj.shareId = crypto.randomBytes(3).toString('hex');
    queue = new Models.Queue(obj);
    queue.save(function(err, data){
      console.log("Saved");
      if(err){
        d.reject(err);
      } else {
        d.resolve(data);
      }
    });
    return d.promise;
  },

  updateQueue: function(id, obj) {
    var d = Q.defer();
    Models.Queue.findOne({shareId: id}, function(err, model){
      for (var key in obj) {
        if( obj.hasOwnProperty(key) ) {
          if(key !== "shareId"){
            model[key] = obj[key];
          }
        }
      }
      model.markModified('songs');
      model.save(function(err, model){
        if(err){
          d.reject(err);
        }
        d.resolve(model);
      });
    });

    return d.promise;
  },

  addSongToQueue: function(id, song) {
    var d = Q.defer();
    Models.Queue.findOne({shareId: id}, function(err, model){
      if(Array.isArray(song)){
        model.songs = model.songs.concat(song);
      } else {
        model.songs.push(song);
      }
      model.markModified('songs');
      model.save(function(err, model){
        if(err){
          d.reject(err);
        } else {
          d.resolve(song);
        }
      });
    });

    return d.promise;
  },

  removeSongFromQueue: function(id, index){
    var d = Q.defer();
    Models.Queue.findOne({shareId: id}, function(err, model){
      if(err){
        d.reject(err);
      } else {
        if (index > -1) {
          var removed = model.songs.splice(index, 1)[0];
          model.markModified('songs');
          model.save(function(err, model){
            if(err){
              d.reject(err);
            } else {
              d.resolve(removed[0]);
            }
          });
        } else {
          d.reject("Index out of Bounds!", index);
        }
      }
    });

    return d.promise;
  },


/* ======== Playlist Helpers ======== */
  getUserPlaylists: function(username){
    var d = Q.defer();
    Models.User.findOne({username: username}, function(err, user){
      if(err){
        d.reject(err);
      } else {
        d.resolve(user.playlists);
      }
    });
    return d.promise;
  },

  getUserPlaylist: function(username, id){
    var d = Q.defer();
    Models.User.findOne({username: username}, function(err, user){
      if(err){
        d.reject(err);
      } else {
        d.resolve(user.playlists[id]);
      }
    });
    return d.promise;
  },

  createPlaylist: function(username, playlist){
    var d = Q.defer();
    playlist.id = crypto.randomBytes(4).toString('hex');
    Models.User.findOne({username: username}, function(err, user){
      if(err){
        d.reject(err);
      } else {
        user.playlists[playlist.id] = playlist;
        user.markModified("playlists");
        user.save(function(err, user){
          d.resolve(playlist);
        });
      }
    });
    return d.promise;
  },

  updatePlaylist: function(username, id, playlist){
    var d = Q.defer();
    Models.User.findOne({username: username}, function(err, user){
      if(err){
        d.reject(err);
      } else {
        for (var key in playlist) {
          if( playlist.hasOwnProperty(key) ) {
            if(key !== "id"){
              user.playlists[id][key] = playlist[key];
            }
          }
        }
        user.markModified("playlists");
        user.save(function(err, user){
          if(err){
            d.reject(err);
          } else {
            d.resolve(playlist);
          }
        });
      }
    });
    return d.promise;
  },

  addSongToPlaylist: function(username, id, song){
    var d = Q.defer();
    Models.User.findOne({username: username}, function(err, user){
      if(err){
        d.reject(err);
      } else {
        if(Array.isArray(song)){
          user.playlists[id].songs = user.playlists[id].songs.concat(song);
        } else {
          user.playlists[id].songs.push(song);
        }
        user.markModified("playlists");
        user.save(function(err, user){
          if(err){
            d.reject(err);
          } else {
            d.resolve(song);
          }
        });
      }
    });
    return d.promise;
  },

  removeSongFromPlaylist: function(username, id, index){
    var d = Q.defer();
    Models.User.findOne({username: username}, function(err, user){
      if(err){
        d.reject(err);
      } else {
        if (index > -1) {
          var removed = user.playlists[id].songs.splice(index, 1);
          user.markModified("playlists");
          user.save(function(err, user){
            if(err){
              d.reject(err);
            } else {
              d.resolve(removed[0]);
            }
          });
        } else {
          d.reject("Index out of Bounds!", index);
        }
      }
    });
    return d.promise;
  },

  createUser: function(user){
    var d = Q.defer();
    var newUser = new Models.User(user);
    newUser.save(function(err, user){
      if (err) {
        d.reject(err);
      } else {
        d.resolve(user);
      }
    });

    return d.promise;
  }

};







