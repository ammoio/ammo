var request = require('request');
var dbHelpers = require('./dbHelpers');
var Q = require('q');

// var req = {session: {}};
// req.session.csrf_tokens = ["random", "test", "1234"];



module.exports = {
    validateUser: function(code, sessionId){
      var d = Q.defer();

      console.log(code);
      console.log(sessionId);

      var addSession = function (user) {
        dbHelpers.addSession(user.username, sessionId)
        .then(function(user){
          d.resolve(user);
        })
        .fail(function(err){
          console.log("there was an error");
          d.reject("There was a failure at the database");
        });
      };


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

        //Fetch username from facebook
        request.get({
          url: "https://graph.facebook.com/me?access_token=" + data.access_token
        }, function(err, req, body){
          var fbUser = JSON.parse(body);
          dbHelpers.getUser({username: fbUser.username})
          //The user exists in the DB
          .then(function(user){
            addSession(user);
          })
          //the user does not exist, create it
          .fail(function(err){
            dbHelpers.createUser(fbUser)
            .then(function(user){
              addSession(user);
            })
            .fail(function(err){
              d.reject(err);
            });
          });
        });
      });

      return d.promise;
    },

    validateSession: function(username, sessionId){
      var d = Q.defer();
      console.log("validating", username);
      console.log("sessionId", sessionId);

      dbHelpers.getSession(username)
      .then(function(validSessionId){
        if (validSessionId && validSessionId === sessionId) {
          d.resolve(true);
        } else {
          d.reject("not logged in");
        }
      })
      .fail(function(err){
        d.reject(err);
      });

      return d.promise;
    },

    closeSession: function(sessionId){
      var d = Q.defer();

      dbHelpers.closeSession({sessionId: sessionId})
      .then(function(data){
          d.resolve(true);
      })
      .fail(function(err){
        d.reject(err);
      });

      return d.promise;
    },

    isAuthorized: function(shareId, sessionId){
      var d = Q.defer();
      console.log("SessionId: ",sessionId);
      dbHelpers.getQueue(shareId)
      .then(function (queue){
        console.log("Private: ", queue.isPrivate);
        if(queue.isPrivate){
          return module.exports.validateSession(queue.username, sessionId);
        } else {
          return true;
        }
      })
      .then(function(){
        d.resolve(true);
      })
      .fail(function(err){
        d.reject(err);
      });

      return d.promise;
    }

};