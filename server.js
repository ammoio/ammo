/*
 * Module dependencies
 */

var fortune = require('fortune'),
  express = require('express'),
  http = require('http'),
  path = require('path'),
  logger = require('morgan'),
  app = express();

/*
 * Variables
 */

var usersAPI,
    playlistsAPI,
    songsAPI;

usersAPI = fortune({ db: 'users' })
  .resource('user', {
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    fullName: String,
    facebookId: String,
    playlists: ['playlist'] // hasMany relationship
  });

playlistsAPI = fortune({ db: 'playlists' })
  .resource('playlist', {
    name: String,
    permissions: String,
    songs: ['song'],
    owner: 'user' // belongsTo
  });

songsAPI = fortune({ db: 'songs' })
  .resource('song', {
    title: String,
    artist: String,
    duration: Number,
    service: String
  });

app
  .set('port', process.env.PORT || 3000)
  .use(logger())
  .use(usersAPI.router)
  .use(playlistsAPI.router)
  .use(songsAPI.router)
  .use(express.static(path.join(__dirname, 'build')))
  .use('/static', express.static(path.join(__dirname, 'static')))
  .use(app.router);

http.createServer(app)
  .listen(app.get('port'), function () {
    console.log('What happens on port ' + app.get('port') + ' stays on port ' + app.get('port'));
  });

