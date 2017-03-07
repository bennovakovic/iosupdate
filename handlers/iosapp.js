'use strict';
var express = require('express');
var router   = express.Router();
var path = require('path');
var fs = require('fs');
var os = require('os');
var mv = require('mv');
var isValidBundle = require('../middleware/is_valid_bundle');

exports = module.exports = opsapp;

var readVersionJson = function(path, callback) {
  fs.readFile(path, 'utf8', function(err, data) {
    if(!err) {
      var json = JSON.parse(data);
      callback(err, json);
    }
    else {
      callback(err, null);
    }
  });
};

function opsapp(app, settings){

  var iosTemplate = 'index.html';
  var iosBundlePlist = 'AppDefinition.plist';

  function getVersionPath(bundle) {
    return path.join(settings.DATA_DIR, bundle, 'version.json');
  }
  function getBuildUrl(bundle, name, version) {
    return settings.SERVER_URL + '/' + path.join(bundle, 'builds', name + '_' + version + settings.IOS_APP_EXTENSION);
  }
  function getBuildPath(bundle, name) {
    return path.join(settings.DATA_DIR, bundle, 'builds', name + settings.IOS_APP_EXTENSION);
  }

  // return the latest version
  router.get('/:bundle/version.json', isValidBundle, function(req, res) {
    readVersionJson(getVersionPath(req.params.bundle), function(err, data) {
      if(!err) {
        res.send(JSON.stringify(data));
      }
      else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ error: true, message : 'No version information found...', help : 'Please try uploading your first app.'}));
      }
    });
  });

  // return the plist
  router.get('/:bundle/app.plist', isValidBundle, function(req, res) {
    readVersionJson(getVersionPath(req.params.bundle), function(err, data) {
      if(err) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ error: true, message : 'No version information found...', help : 'Please try uploading your first app.'}));
        return;
      }
      var name = data.bundle.split('.').pop();
      res.setHeader('Content-Type', 'text/xml');
      res.render(iosBundlePlist, {
        bundle: data.bundle,
        filename: getBuildUrl(data.bundle, name, data.build),
        version: data.version,
        build: data.build,
        name: name
      });
    });
  });

  // for downloading builds
  router.get('/:bundle/builds/:name' + settings.IOS_APP_EXTENSION, isValidBundle, function(req, res) {
    var _path = getBuildPath(req.params.bundle, req.params.name);
    res.download(_path);
  });

  // return the actual html page for downloading.
  router.get('/:bundle', isValidBundle, function(req, res) {
    res.render(iosTemplate, {
      plist_path : settings.SERVER_URL + '/' + path.join(req.params.bundle, 'app.plist')
    });
  });

  // return the actual html page for downloading.
  router.post('/:bundle/upload', isValidBundle, function(req, res) {
    if (req.busboy) {
      var _saveToPath;
      var _filename;
      var _fields = {};

      // make the project paths
      var baseAppPath = path.join(settings.DATA_DIR, req.params.bundle);
      var buildPath = path.join(baseAppPath, 'builds');
      if (!fs.existsSync(baseAppPath)) {
        fs.mkdir(baseAppPath, function() {
            fs.mkdir(buildPath, function() {});
        });
      }

      req.busboy.on('file', function(fieldname, file, filename /*, encoding, mimetype*/) {
        _saveToPath = path.join(os.tmpDir(), path.basename(fieldname));
        _filename = filename;
        file.pipe(fs.createWriteStream(_saveToPath));
      });
      req.busboy.on('field', function(key, value /*, keyTruncated, valueTruncated */) {
        _fields[key] = value;
      });
      req.busboy.on('finish', function() {
        var fnparts = _filename.split('.');
        var newfn = fnparts[0] + '_' + _fields.build;
        var newPath = getBuildPath(req.params.bundle, newfn);
        mv(_saveToPath, newPath, function(err) {
          if (err) {
            res.writeHead(500, { 'Connection': 'close' });
            res.end('failed to move the file');
          }
          else {
            var versionFile = getVersionPath(req.params.bundle);
            fs.writeFile(versionFile, JSON.stringify(_fields), 'utf-8', function(err2) {
              if (err2) {
                res.writeHead(500, { 'Connection': 'close' });
                res.end('failed to write version json');
              }
              else {
                res.writeHead(200, { 'Connection': 'close' });
                res.end('success');
              }
            });
          }
        });
      });
    }

  });
  return router;
}
