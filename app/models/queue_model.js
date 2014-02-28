var mongoose = require('mongoose');
var crypto = require('crypto');
var Q = require('q');

var queueSchema = mongoose.Schema({
  name: String,
  shareId: String,
  listenId: String,
  lastAccessed: Date,
  songs: {type: [], 'default': []},
  currentSong: Number,
  isPrivate: {type: Boolean, 'default': false},
  username: {type: String, 'default': "guest"}
});

queueSchema.statics = {
  getQueues: function(){
    var d = Q.defer();
    this.find(function(err, data){
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
    var query;
    if(id.length === 16){
      query = {listenId: id};
    } else if (id.length === 4) {
      query = {shareId: id};
    } else {
      d.reject("invalid ID length");
    }

    this.findOne(query, function(err, data){
      if(err){
        d.reject(err);
      } else {
        if(!data){
          d.reject("shareId not found");
          return;
        }
        data._id = undefined;
        d.resolve(data);
      }
    });
    return d.promise;
  },

  createQueue: function(obj){
    var d = Q.defer();
    obj.shareId = crypto.randomBytes(4).toString('base64').slice(0, 4).replace(/\//g, 'a').replace(/\+/g, 'z');
    obj.listenId = crypto.randomBytes(16).toString('base64').slice(0, 16).replace(/\//g, 'a').replace(/\+/g, 'z');
    queue = new this(obj);
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
    this.findOne({shareId: id}, function(err, model){
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
    this.findOne({shareId: id}, function(err, model){
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
    this.findOne({shareId: id}, function(err, model){
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
              d.resolve(removed);
            }
          });
        } else {
          d.reject("Index out of Bounds!", index);
        }
      }
    });

    return d.promise;
  }
};

module.exports = mongoose.model('Queue', queueSchema);