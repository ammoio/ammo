/**
 * AuthController
 */

var jwt = require('jwt-simple'),
    moment = require('moment'),
    request = require('request'),
    qs = require('querystring');


module.exports = {

  me: function(req, res, next) {
    User.findOne(req.userId)
      .then(function(result) {
        if (!result) {
          res.forbidden();
        }
        return res.ok(result);
      })
      .error(function(err) {
        return next(err);
      });
  },

  facebookLogin: function(req, res, next) {
    var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token',
        graphApiUrl = 'https://graph.facebook.com/me',
        params = {
          client_id: req.body.clientId,
          redirect_uri: req.body.redirectUri,
          client_secret: sails.config.secrets.FACEBOOK_SECRET,
          code: req.body.code
        };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
      accessToken = qs.parse(accessToken);

      // Step 2. Retrieve profile information about the current user.
      request.get({ url: graphApiUrl, qs: accessToken, json: true }, function (err, response, profile) {

        if (!req.headers.authorization) {
          // Step 3. Create a new user account or return an existing one.
          User.findOrCreate({ facebookId: profile.id }, {
            email: profile.email,
            username: profile.username,
            firstName: profile.first_name,
            lastName: profile.last_name,
            fullName: profile.name,
            facebookId: profile.id
          })
            .then(function (user) {
              return res.send({ token: createToken(user) });
            })
            .catch(function (err) {
              return next(err);
            });
        }
      });
    });
  }
};

function createToken(user) {
  var payload = {
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, sails.config.secrets.TOKEN_SECRET);
}

