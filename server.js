'use strict';
var compression = require('compression');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var swig = require('swig');
var swigFilters = require('./swig/filters');
var settings = require('./local_settings');
var fs = require('fs');
var path = require('path');

// make sure we were passed a port
var port = process.argv[2];
if(!port) {
  console.error('Usage: npm server <port>');
  process.exit(-1);
}

// setup express to use compression
app.use(compression());

// use swig for templates
app.engine('html', swig.renderFile);
app.engine('plist', swig.renderFile);

app.set('views', settings.TEMPLATE_PATH);
app.set('view engine', 'html');
app.set('_settings', settings);


// cache the views?
app.set('view cache', settings.CACHE_TEMPLATES);
swig.setDefaults({ cache: settings.CACHE_TEMPLATES });

// should express serve static?
if(settings.SERVE_STATIC) {
  app.use('/static', express.static(settings.STATIC_PATH));
}

// apply the swig filters
swigFilters(swig, {app : app, settings : settings});

app.disable('x-powered-by');

// load the app
var App = require('./app')(app, settings);
app.use('/', App);

// setup the bundle folders.
// for(var app in settings.VALID_BUNDLES) {
//   // settings.VALID_BUNDLES[app]
//   var baseAppPath = path.join(settings.DATA_DIR, settings.VALID_BUNDLES[app]);
//   var buildPath = path.join(baseAppPath, 'builds');
//   if (!fs.existsSync(baseAppPath)) {
//     fs.mkdir(baseAppPath, function() {
//         fs.mkdir(buildPath, function() {});
//     });
//   }
// }


// run the server
http.listen(parseInt(port, 10), function(){
  console.log('listening on *:' + port);
});