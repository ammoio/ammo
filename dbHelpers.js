/*
 * Database Helper Functions
*/

var mongoose = require('mongoose');
var Q = require('q');
var Models = require('./models');

module.exports = {
  getQueues = function(){
    var d = Q.defer();
    Models.Queue.find(); 
      
    return d.promise;
  };

};
