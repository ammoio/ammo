module.exports = {
  index: function(req, res, next) {
    if (req.path.match(/\..*/g) || req.path.match(/^\/api\/.*$/)) {
      return next();
    }

    return res.sendfile(sails.config.appPath + '/build/index.html');
  }
};
