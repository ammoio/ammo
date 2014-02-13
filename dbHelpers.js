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
    Models.Queue.find({shareId: id}, function(err, data){
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
      if(err){
        d.reject(err); 
      } else {
        d.resolve(data);
      }
    }); 
    return d.promise;
  },

};
