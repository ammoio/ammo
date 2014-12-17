/**
 * SongController
 */

module.exports = {
  createSong: function(req, res) {
    Song.findOrCreate({ id: req.body.serviceId }, req.body)
      .then(function(song) {
        res.ok(song);
      })
      .catch(function(err) {
        res.serverError(err);
      });
  }
};
