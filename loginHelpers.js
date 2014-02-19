var request = require('request');
var dbHelpers = require('./dbHelpers');
var Q = require('q');

// var req = {session: {}};
// req.session.csrf_tokens = ["random", "test", "1234"];



module.exports = {
    validateUser: function(code, sessionId){
      var d = Q.defer();

      request.post({
        url: 'https://oauth.io/auth/access_token',
        form: {
          code: code,
          key: "YTaWoCjSvB9X8LcCyc8hn6sp798",            // The public key from oauth.io
          secret: "r_GbPTQSfoJyaahblrZMSb5nBIg"         // The secret key from oauth.io
        }
      }, function (err, req, body) {
        var data = JSON.parse(body);
        if ( !data.state ) {
            d.reject("Got error:" + body);
        }
        if (data.state !== sessionId) {
            d.reject("Oups, state does not match !");
        }

        dbHelpers.addSession("username", sessionId)
        .then(function(user){
          d.resolve(user);
        })
        .fail(function(err){
          console.log("there was an error");
          d.reject("There was a failure at the database");
        });

      });

      return d.promise;
    },

    validateSession: function(username, sessionId){
      var d = Q.defer();

      dbHelpers.getSession(username)
      .then(function(validSessionId){
        if (validSessionId && validSessionId === sessionId) {
          d.resolve(true);
        } else {
          d.reject(false);
        }
      })
      .fail(function(err){
        d.reject(err);
      });

      return d.promise();
    },

    closeSession: function(sessionId){
      var d = Q.defer();

      dbHelpers.closeSession(username)
      .then(function(data){
          d.resolve(true);
      })
      .fail(function(err){
        d.reject(err);
      });

      return d.promise();
    }

};

request.post({
        url: 'https://oauth.io/auth/access_token',
        form: {
            code: "leKPXXEZym1PnTFrDiiSHCWwpXU",
            key: "YTaWoCjSvB9X8LcCyc8hn6sp798",            // The public key from oauth.io
            secret: "r_GbPTQSfoJyaahblrZMSb5nBIg"         // The secret key from oauth.io
    }}, function (e,r,body) {
    var data = JSON.parse(body);
    req.session.csrf_tokens = req.session.csrf_tokens || [];
    if ( ! data.state) {
        res.send("Got error:" + body);
        return next();
    }
    if (req.session.csrf_tokens.indexOf(data.state) == -1) {
        res.send("Oups, state does not match !");
        return next();
    }
    console.log("Success:");
    console.dir(data);
    });