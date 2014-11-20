/*
 * Module dependencies
 */

var fortune = require('fortune'),
  express = require('express'),
  http = require('http'),
  path = require('path'),
  logger = require('morgan');

/*
 * Variables
 */

var port = process.argv[2] || 3000;
    app = fortune({
      adapter: 'mongodb',
      host: '172.17.0.2'
    });

app
  .resource('user', {
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    fullName: String,
    facebookId: String,
    playlists: ['playlist'] // hasMany relationship
  })

  .resource('playlist', {
    name: String,
    permissions: String,
    songs: ['song'],
    owner: 'user' // belongsTo
  })

  .resource('song', {
    title: String,
    artist: String,
    duration: Number,
    service: String
  })

  .use(logger())
  .use(express.static(path.join(__dirname, 'build')))
  .use('/static', express.static(path.join(__dirname, 'static')))

  .listen(port, function() {
    console.log('What happens on port ' + port + ' stays on port ' + port);
  });

