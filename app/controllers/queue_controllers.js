var loginHelpers = require('../loginHelpers');
var User = require('../models/user_model');
var Queue = require('../models/queue_model');
var socketServer = require('../sockets');

/* ======== Queue Controllers ========*/

module.exports = {

  getQueues: function(req, res){
    Queue.getQueues()
    .then(function(queues){
      res.send(queues);
    })
    .fail(function (err) {
      res.send(500, err);
    });
  },

  getQueue: function(req, res){
    Queue.getQueue(req.params.id)
    .then(function(queue){
      res.send(queue);
    })
    .fail(function (err) {
      res.send(500, err);
    });
  },

  createQueue: function (req, res) {
    Queue.createQueue(req.body)
    .then(function(queue){
      res.send(queue);
    })
    .fail(function (err) {
      res.send(500, err);
    });
  },

  addSong: function(req, res){
    loginHelpers.isAuthorized(req.params.id, req.cookies['ammoio.sid'])
    .then(function(){
      return Queue.addSongToQueue(req.params.id, req.body);
    })
    .then(function(song){
      res.send(song);
    })
    .fail(function (err) {
      console.log(err);
      if(err === "not logged in"){
        res.send(401);
      } else {
        res.send(500, err);
      }
    });
  },

  update: function(req, res){
     loginHelpers.isAuthorized(req.params.id, req.cookies['ammoio.sid'])
    .then(function(){
      return Queue.updateQueue(req.params.id, req.body);
    })
    .then(function(queue){
      socketServer.emit('updateView', {shareId: queue.shareId});
      res.send(queue);
    })
    .fail(function (err) {
      if(err === "not logged in"){
        res.send(401);
      } else {
        res.send(500, err);
      }
    });
  },

  deleteSong: function(req, res){
    loginHelpers.isAuthorized(req.params.id, req.cookies['ammoio.sid'])
    .then(function(){
      return Queue.removeSongFromQueue(req.params.id, req.params.index);
    })
    .then(function(song){
      res.send(song);
    })
    .fail(function (err) {
      if(err === "not logged in"){
        res.send(401);
      } else {
        res.send(500, err);
      }
    });
  },

  renderShareIndex: function (req, res) {
    Queue.getQueue(req.params.id)
    .then(function(queue){
      res.sendfile('/public/shareIndex.html', {root: __dirname + '/../..'});  
    })
    .fail(function (err) {
      res.redirect('/');
    });
  }

};
