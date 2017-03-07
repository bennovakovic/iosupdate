'use strict';

function is_valid_bundle(req, res, next) {
  var parts = req.url.replace(/^\/|\/$/g, '').split('/');
  if(req.valid_bundles.indexOf(parts[req.bundle_index]) > -1) {
    return next();
  }
  else {
    next('route');
  }
}

exports = module.exports = is_valid_bundle;