/*
 * Database Helper Functions
*/

var mongoose = require('mongoose');
var Q = require('q');
var Models = require('./models');

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
  

};
