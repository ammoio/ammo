/**
 * isPlaylistOwner
 *
 * @module      :: Policy
 * @description :: Verify if a user is the playlist owner
 */
module.exports = function(req, res, next) {
  if (!req.userId) {
    return res.forbidden();
  }

  Playlist.findOne(req.params.parentid)
    .then(function(playlist) {
      if (playlist.owner === req.userId) {
        return next();
      } else {
        return res.forbidden();
      }
    })
    .catch(function(err) {
      return res.notFound(400, err);
    });
};
