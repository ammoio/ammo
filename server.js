
/*
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var Routes = require('./app/routes.js');

var dbHelpers = require('./app/dbHelpers');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
  secret: '1234567890QWERTY',
  key: 'ammoio.sid',
  cookie: { httpOnly: false }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

Routes(app);


var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('What happens on port ' + app.get('port') + " stays on port " + app.get('port'));
});


//socket io logic
var io = require('socket.io').listen(server);
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
