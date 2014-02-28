var mongoose = require('mongoose');
var crypto = require('crypto');
var Q = require('q');
var Queue = require('./queue_model');

var userSchema = mongoose.Schema({
  username: String,
  sessionId: {type: String, 'default': null},
  email: String,
  name: String,
  playlists: {type: [], 'default': []}
});

userSchema.statics = {
  getUser: function(query){
    var d = Q.defer();

    this.findOne(query, function(err, user){
      if(err){
        d.reject(err);
      } else {
        if(!user) {
          d.reject(user);
        } else {
          delete user.sessionId;
          d.resolve(user);
        }
      }
    });

    return d.promise;
  },

  addSession: function(username, sessionId){
    var d = Q.defer();
    this.findOne({username: username}, function(err, user){
      if(err){
        d.reject(err);
      } else {
        user.sessionId = sessionId;
        user.save(function(err, data){
          if (err) {
            d.reject(err);
          } else {
            delete data.sessionId;
            d.resolve(data);
          }
        });
      }
    });

    return d.promise;
  },

  getSession: function(username){
    var d = Q.defer();
    this.findOne({username: username}, function(err, user){
      if(err){
        d.reject(err);
      } else {
        if(!user){
          d.reject("no user found");
        } else {
          d.resolve(user.sessionId);
        }
      }
    });

    return d.promise;
  },

  closeSession: function(query) {
    var d = Q.defer();
    this.findOne(query, function(err, user){
      if(err){
        d.reject(err);
      } else {
        if(!user){
          d.reject("User Doesnt Exist");
        } else {
          user.sessionId = null;
          user.save(function(err, data){
            if (err) {
              d.reject(err);
            } else {
              d.resolve(data.sessionId);
            }
          });
        }
      }
    });

    return d.promise;
  },

  findOrCreate: function(user){
    var d = Q.defer();
    var that = this;
    this.findOne({username: user.username}, function(err, data){
      if(err){
        d.reject(err);
      } else {
        if(data === null){
          var newUser = new that(user);
          newUser.save(function(err, user){
            if (err) {
              d.reject(err);
            } else {
              d.resolve(user);
            }
          });
        } else {
          d.resolve(data);
        }
      }
    });

    return d.promise;
  },

  getPlaylists: function(username){
    var d = Q.defer();
    this.findOne({username: username}, function(err, user){
      if(err){
        d.reject(err);
      } else {
        if (!user){
          d.reject("no user found");
        } else {
          d.resolve(user.playlists);
        }
      }
    });
    return d.promise;
  },

  createPlaylist: function(username, playlist){
    var d = Q.defer();
    this.findOne({username: username}, function(err, user){
      if(err){
        d.reject(err);
      } else {
        if (!user) {
          d.reject("no user found");
        } else {
          playlist.isPrivate = true;
          playlist.username = username;
          Queue.createQueue(playlist).then(function(queue){
            user.playlists.push({shareId: queue.shareId, name: queue.name});
            user.markModified("playlists");
            user.save(function(err, user){
              if(err){
                d.reject(err);
              } else {
                d.resolve(queue);
              }
            });
          })
          .fail(function(err){
            d.reject(err);
          });
        }
      }
    });
    return d.promise;
  },

  updateUser: function(username, obj) {
    var d = Q.defer();
    this.findOne({username: username}, function(err, model){
      for (var key in obj) {
        if( obj.hasOwnProperty(key) ) {
          if(key !== "username"){
            model[key] = obj[key];
          }
        }
      }
      model.markModified('playlists');
      model.save(function(err, model){
        if(err){
          d.reject(err);
        }
        d.resolve(model);
      });
    });

    return d.promise;
  }

};



module.exports = mongoose.model('User', userSchema);
