/**
 * PlaylistController
 */

module.exports = {

  create: function(req, res) {
    req.body.owner = req.userId;

    Playlist.create(req.body)
      .then(function(result) {
        res.ok(result);
      })
      .catch(function(err) {
        res.notFound(err);
      });
  },

  addSong: function(req, res) {
    var playlist;

    Playlist.findOne(req.params.parentid)
      .then(function(result) {
        playlist = result;
        return Song.findOrCreate({ id: req.body.id }, req.body);
      })
      .then(function(song) {
        playlist.songs.add(song.id);
        return playlist.save();
      })
      .then(function() {
        res.ok(playlist);
      })
      .catch(function(err) {
        res.serverError(err);
      });
  }
};

