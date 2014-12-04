module.exports.http = {
  customMiddleware: function(app) {
    app
      .use(require('../node_modules/sails/node_modules/express').static(sails.config.appPath + '/build'))
      .use('/static', require('../node_modules/sails/node_modules/express').static(sails.config.appPath + '/static'))
      .use('/bower_components/angular-material', require('../node_modules/sails/node_modules/express').static(sails.config.appPath + '/bower_components/angular-material'));
  }
};
