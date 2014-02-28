var Queue = require('./models/queue_model');
var socketio = require('socket.io');

var io;

module.exports = {
  startSocketServer: function (server) {
    io = socketio.listen(server);

    io.sockets.on('connection', function (socket) {
      socket.on('queueChanged', function (data) {
        //broadcast emit message to everyone but the original sender
        socket.broadcast.emit('updateView', data);
      });
      socket.on('voteUp', function (data) {
        Queue.updateQueue(data.shareId, data.songs)
          .then(function (data) {
            io.sockets.emit('updateView', data);
          });
      });
    });
  },

  emit: function (event, data) {
    io.sockets.emit(event, data);
  }


};