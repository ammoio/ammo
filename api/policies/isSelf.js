/**
 * isPlaylistOwner
 *
 * @module      :: Policy
 * @description :: Verify if a user is the playlist owner
 */
module.exports = function(req, res, next) {
  if (!req.userId) {
    return res.notFound();
  }

  User.findOne(req.params.parentid)
    .then(function(user) {
      if (user.id === req.userId) {
        return next();
      } else {
        return res.forbidden();
      }
    })
    .catch(function(err) {
      return res.notFound(err);
    });
};
