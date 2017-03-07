var path  = require('path');

module.exports = function(name) {
  var filter = {
    name : name || 'static_url',
    handler : function(app, settings) {
      return function (input) {
        return path.join(settings.STATIC_URL_PREFIX, input);
      }
    }
  }
  return filter;
};