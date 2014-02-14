
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
  dbHelpers.getQueues()
  .then(function(queues){
    res.send(queues);
  })
  .fail(function (err) {
    res.send(500, err);
  });
});

app.get('/queues/:id', function(req, res){
  dbHelpers.getQueue(req.params.id)
  .then(function(queue){
    res.send(queue);
  })
  .fail(function (err) {
    res.send(500, err);
  });
});

app.post('/queues', function (req, res) {
  console.log("Creating: ", req.body);
  dbHelpers.createQueue(req.body)
  .then(function(queue){
    res.send(queue);
  })
  .fail(function (err) {
    res.send(500, err);
  });
});

app.post('/queues/:id/add', function(req, res){
  console.log("Adding song(s)", req.body);
  dbHelpers.addSongToQueue(req.params.id, req.body)
  .then(function(song){
    res.send(song);
  })
  .fail(function (err) {
    res.send(500, err);
  });
});

app.put('/queues/:id', function(req, res){
  console.log("Updating Queue ", req.params.id);
  console.dir("Updating with: ", data);
  dbHelpers.updateQueue(req.params.id, req.body)
  .then(function(queue){
    res.send(queue);
  })
  .fail(function (err) {
    res.send(500, err);
  });
});



//Catch-all Route
app.get('*', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});




http.createServer(app).listen(app.get('port'), function(){
  console.log('What happens on port ' + app.get('port') + " stays on port " + app.get('port'));
});
