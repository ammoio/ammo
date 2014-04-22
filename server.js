// Module dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./app/routes/routes.js');
var sockets = require('./app/sockets.js');
var mongoose = require('mongoose');
var errorhandler  = require('./app/error.js');
var app = express();

app.use(errorhandler);
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

// Get config variables depending on the environment
var env = app.get('env');

if (env === 'development') {
  app.use(express.errorHandler());
}

app.set('port', process.env.PORT);
mongoose.connect(process.env.MONGO_URI);

routes(app);

var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('What happens on port ' + app.get('port') + " stays on port " + app.get('port'));
});

sockets.startSocketServer(server);

