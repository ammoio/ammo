var request = require('request');
var dbHelpers = require('./dbHelpers');
var Q = require('q');

// var req = {session: {}};
// req.session.csrf_tokens = ["random", "test", "1234"];



module.exports = {
    validateSession: function(code, sessionId){
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
          res.send("Got error:" + body);
          return;
      }
      if (data.state !== sessionId) {
          res.send("Oups, state does not match !");
          return;
      }

      dbHelpers.addSession("username", sessionId)
      .then(function(sessionId){
        d.resolve(sessionId + "Added Successfully");
      })
      .fail(function(err){
        console.log("there was an error");
        d.reject("There was a failure at the database");
      });

      console.log("Success:");
      console.dir(data);
      });

      return d.promise;
    },

    closeSession: function(sessionId){

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