var staticUrl = require('./filter.static_url')();


var swigFilters = function(swig, opts) {
  var filters = [staticUrl];

  // apply them
  for(var f in filters) {
    var filter = filters[f];
    swig.setFilter(filter.name, filter.handler(opts.app, opts.settings));
  }
}

module.exports = swigFilters;