var jwt = require('jwt-simple');
    moment = require('moment');

/**
 * isLoggedIn
 *
 * @module      :: Policy
 * @description :: Verify if a user is authenticated
 */
module.exports = function(req, res, next) {
  var token,
      payload;

  if (!req.headers.authorization) {
    return res.forbidden('Please make sure your request has an Authorization header');
  }

  token = req.headers.authorization.split(' ')[1];
  payload = jwt.decode(token, sails.config.secrets.TOKEN_SECRET);

  if (payload.exp <= moment().unix()) {
    return res.forbidden('Token has expired');
  }

  req.userId = payload.sub;
  return next();
};
