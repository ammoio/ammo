
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var dbHelpers = require('./dbHelpers');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Server Routes
app.get('/queues', function(req, res){
  dbHelpers.getQueues().then(function(data){
    res.send(data);
  }).fail(function (err) {
    res.send(500, err);
  });
});

app.get('/queues/:id', function(req, res){
});

app.post('/queues', function (req, res) {
  res.send('need to implement post');
});

app.post('/queues/:id/add', function(req, res){

});



//Catch-all Route
app.get('*', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});




http.createServer(app).listen(app.get('port'), function(){
  console.log('What happens on port ' + app.get('port') + " stays on port " + app.get('port'));
});
