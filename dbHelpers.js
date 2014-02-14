/*
 * Database Helper Functions
*/

var mongoose = require('mongoose');
var Q = require('q');
var crypto = require('crypto'); 
var Models = require('./models');

mongoose.connect('mongodb://localhost/ammo');

module.exports = {
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
          model[key] = obj[key];
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
        model.songs.concat(song);
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
  }


};







