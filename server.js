
/*
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var dbHelpers = require('./dbHelpers');
var loginHelpers = require('./loginHelpers');


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
app.use(express.session({secret: '1234567890QWERTY'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//require('.////')(app)
/* ======== User Routes ========*/
app.post('/login', function(req, res){
  // console.log(req.body);
  // console.log(req.cookies);
  loginHelpers.validateUser(req.body.code, req.cookies.sessionId)
  .then(function(user){
    console.log("Validated Session", user);
    res.send(user);
  })
  .fail(function(err){
    res.send(418);
  });
});

app.get('/logout', function(req, res){
  loginHelpers.closeSession(req.cookies.sessionId)
  .then(function(sessionId){
    console.log("Canceled Session", sessionId);
    req.cookies.sessionId = null;
    res.send("Successfully cancelled Session", sessionId);
  })
  .fail(function(err){
    res.send(401);
  });
});

app.get('/user', function(req, res){
  console.dir(req.cookies);
  dbHelpers.getUser({sessionId: req.cookies.sessionId})
  .then(function(user){
    console.log(user);
    res.send(user);
  })
  .fail(function(err){
    res.send(401);
  });
});

/* ======== Queue Routes ========*/
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

//POST: add song to queue
app.post('/queues/:id/add', function(req, res){
  loginHelpers.isAuthorized(req.params.id, req.cookies.sessionId)
  .then(function(){
    return dbHelpers.addSongToQueue(req.params.id, req.body);
  })
  .then(function(song){
    console.log("ADDED SONG");
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
});

//PUT update queue
app.put('/queues/:id', function(req, res){
   loginHelpers.isAuthorized(req.params.id, req.cookies.sessionId)
  .then(function(){
    return dbHelpers.updateQueue(req.params.id, req.body.data);
  })
  .then(function(queue){
    res.send(queue);
  })
  .fail(function (err) {
    if(err === "not logged in"){
      res.send(401);
    } else {
      res.send(500, err);
    }
  });
});

//DELETE: Delete Song at index
app.delete('/queues/:id/:index', function(req, res){
  loginHelpers.isAuthorized(req.params.id, req.cookies.sessionId)
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
});



/* ======== Playlist Routes ========*/
//GET: all user playlists
app.get('/:user/playlists', function(req, res){
  dbHelpers.getUserPlaylists(req.params.user)
  .then(function(playlists){
    res.send(playlists);
  })
  .fail(function (err) {
    res.send(500, err);
  });
});

//GET: user playlist by id //DEPRECATED -- use queue endpoint
app.get('/:user/playlists/:id', function(req, res){
  res.send(410);
  // dbHelpers.getUserPlaylist(req.params.user, req.params.id)
  // .then(function(playlist){
  //   res.send(playlist);
  // })
  // .fail(function (err) {
  //   res.send(500, err);
  // });
});

//POST: Add song to playlist //DEPRECATED, use queue endpoint
app.post('/:user/playlists/:id', function(req, res){
  res.send(410);
  // dbHelpers.addSongToPlaylist(req.params.user, req.params.id, req.body)
  // .then(function(song){
  //   res.send(song);
  // })
  // .fail(function (err) {
  //   res.send(500, err);
  // });
});

//PUT: Update Playlist //DEPRECATED, use queue endpoint
app.put('/:user/playlists/:id', function(req, res){
  res.send(410);
  // dbHelpers.updatePlaylist(req.params.user, req.params.id, req.body)
  // .then(function(playlist){
  //   res.send(playlist);
  // })
  // .fail(function (err) {
  //   res.send(500, err);
  // });
});

//POST: Create Playlist
app.post('/:user/playlists', function(req, res){
  loginHelpers.validateSession(req.params.user, req.cookies.sessionId)
  .then(function (response) {
    console.log("Valid Session", req.params.user);
    return true;
  })
  .then(dbHelpers.createPlaylist(req.params.user, req.body))
  .then(function(playlist){
    res.send(playlist);
  })
  .fail(function (err) {
    if(err === "not logged in"){
      res.send(401);
    } else {
      res.send(500, err);
    }
  });
});

//POST: Delete Song at index //DEPRECATED, use queue endpoint
app.post('/:user/playlists/:id/remove', function(req, res){
  res.send(410);
  // dbHelpers.removeSongFromPlaylist(req.params.user, req.params.id, req.body)
  // .then(function(song){
  //   res.send(song);
  // })
  // .fail(function (err) {
  //   res.send(500, err);
  // });
});

//GET: scrape----------------------------------------------------------------------------------
app.get('/scrape/:artist', function(req, res){
  var url = "http://www.theaudiodb.com/api/v1/json/1/search.php?s=" + req.params.artist;
  var data = '';
  http.get(url, function(response) {
    response.on('data', function (chunk) {
      data += chunk;
    });

    response.on('end', function () {
      //res.setHeader()
      res.send(data);
    });
  })
  .on('error', function(e) {
    console.log("Error Scraping Song" + e.message);
  });
});
//-------------------------------------------------------------------------------------------------


//Catch-all Route
app.get('*', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});



var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('What happens on port ' + app.get('port') + " stays on port " + app.get('port'));
});


//socket io logic
var io = require('socket.io').listen(server);
var clients = [];
io.sockets.on('connection', function (socket) {
  console.log('url: ',socket.handshake.query.player);
  socket.on('addSong', function(data) {
    socket.broadcast.emit('newSongAdded', data);
  });
});
