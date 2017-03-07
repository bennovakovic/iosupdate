'use strict';
/*************************

Used for uploading the build to this server.

**************************/

var request = require('request');
var fs = require('fs');
var yargs = require('yargs').argv;

// point this to the location the server is running
var server = 'http://127.0.0.1:5001';

var formData = {
  'version': yargs.version,
  'build' : yargs.build,
  'package' : yargs.package,
  'bundle': yargs.bundle,
  'file': fs.createReadStream(yargs.ipapath)
};

request.post({url:server + '/' + yargs.bundle + '/upload', formData: formData}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log('Upload successful!  Server responded with:', body);
});