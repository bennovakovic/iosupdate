'use strict';
var express = require('express');
var router   = express.Router();
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

module.exports = function(app, settings){

  app.use(busboy({ immediate: true }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(function(req, res, next){
    // Edit request object here
    req.valid_bundles = settings.VALID_BUNDLES;
    req.bundle_index = settings.BUNDLE_URL_INDEX;
    next();
  });

  var AppHandler = require('iosapp')(app, settings);
  router.use('/', AppHandler);


  // handle any routes that dont exist yet.
  router.get('*', function(req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
  });

  // our 404 handler here
  router.use(function on404Handler(err, req, res, next) {
    if(err.status && err.status === 404) {
      res.status(err.status);
      res.render('errors/404.html');
      return;
    }
    next(err);
  });

  // our generic error handler here.
  router.use(function on500Handler(err, req, res) {
    res.status(500);
    res.render('errors/500.html');
  });



  return router;
};
