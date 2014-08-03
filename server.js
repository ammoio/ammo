
/*
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./app/routes/routes.js');
var sockets = require('./app/sockets.js');
var mongoose = require('mongoose');
var errorhandler  = require('./app/error.js');

mongoose.connect('mongodb://localhost/ammo');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
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
app.use(express.static(path.join(__dirname, 'build')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(app.router);

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('What happens on port ' + app.get('port') + " stays on port " + app.get('port'));
});

sockets.startSocketServer(server);

