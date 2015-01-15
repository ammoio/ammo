module.exports.http = {
  customMiddleware: function(app) {
    app
      .use(require('../node_modules/sails/node_modules/express').static(sails.config.appPath + '/build'))
      .use('/static', require('../node_modules/sails/node_modules/express').static(sails.config.appPath + '/static'));
  }
};
