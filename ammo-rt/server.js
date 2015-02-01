var io = require('socket.io').listen(3001),
    realTime;

// Socket io
realTime = io
  .of('/rooms')
  .on('connection', function(socket) {
    socket.on('join', function(room) {
      socket.join(room);
    });

    socket.on('leave', function(room) {
      socket.leave(room);
    });

    socket.on('message', function(data) {
      socket.broadcast.to(data.room).emit('message', data.message);
    });
  });
