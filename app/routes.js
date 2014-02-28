var user = require('./controllers/user_controllers');
var queue = require('./controllers/queue_controllers');
var playlist = require('./controllers/playlist_controllers');
var scrape = require('./controllers/scrape_controllers');


module.exports = function(app){

  /* ======== User Routes ========*/
  app.get('/logout/:username', user.logout);
  app.get('/user', user.getUser);
  app.post('/login', user.login);

  /* ======== Queue Routes ========*/
  app.get('/queues', queue.getQueues);
  app.get('/queues/:id', queue.getQueue);
  app.get('/q/:id', queue.renderShareIndex);
  app.post('/queues', queue.createQueue);
  app.post('/queues/:id/add', queue.addSong);
  app.put('/queues/:id', queue.update);
  app['delete']('/queues/:id/:index', queue.deleteSong);

  /* ======== Playlist Routes ========*/
  app.get('/:user/playlists', playlist.getUserPlaylists);
  app.post('/:user/playlists', playlist.create);

  /* ======== Scrape Routes ========*/
  app.get('/scrape/:artist', scrape.scrape);

  /* ======== Catch-All Route ========*/
  app.get('*', function (req, res) {
    res.sendfile('/public/index.html', {'root': __dirname + '/..'});
  });

};