var dbHelpers = require('./dbHelpers');
var socketio = require('socket.io');

module.exports = function(server){
  var io = socketio.listen(server);

  io.sockets.on('connection', function (socket) {
    socket.on('queueChanged', function(data) {
      //broadcast emit message to everyone but the original sender
      socket.broadcast.emit('updateView', data);
     });
    socket.on('voteUp', function(data) {
      dbHelpers.updateQueue(data.shareId, data.songs)
      .then(function(data){
        io.sockets.emit('updateView', data);
      });
    });
  });
};