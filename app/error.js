/* ======== Express Error Handler Middleware ========*/

module.exports = function (err, req, res, next) {
  if (err) {
    console.error(err);
  } else {
    return next();
  }
};