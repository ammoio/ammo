var loginHelpers = require('../loginHelpers');
var dbHelpers = require('../dbHelpers');

/* ======== Queue Controllers ========*/

module.exports = {

  getQueues: function(req, res){
    dbHelpers.getQueues()
    .then(function(queues){
      res.send(queues);
    })
    .fail(function (err) {
      res.send(500, err);
    });
  },

  getQueue: function(req, res){
    dbHelpers.getQueue(req.params.id)
    .then(function(queue){
      res.send(queue);
    })
    .fail(function (err) {
      res.send(500, err);
    });
  },

  createQueue: function (req, res) {
    dbHelpers.createQueue(req.body)
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
      return dbHelpers.addSongToQueue(req.params.id, req.body);
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
      return dbHelpers.updateQueue(req.params.id, req.body);
    })
    .then(function(queue){
      io.sockets.emit('updateView', {shareId: queue.shareId});
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
      return dbHelpers.removeSongFromQueue(req.params.id, req.params.index);
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
    dbHelpers.getQueue(req.params.id)
    .then(function(queue){
      res.sendfile(__dirname + '/public/shareIndex.html');  
    })
    .fail(function (err) {
      res.redirect('/');
    });
  }

};
