# iosupdate
Node app for over-the-air ios app updates


## local settings

Just put a file called `local_settings.js` in the root folder with overrides from `conf/base.js`

example:
```
'use strict';
var extend = require('extend');
var BASE_SETTINGS = require('./conf/base');
var path = require('path');

var SETTINGS = {};
SETTINGS.DEBUG = true;
SETTINGS.CACHE_TEMPLATES = false;
SETTINGS.SERVER_MODE = 'development';
SETTINGS.SERVE_STATIC = true;
SETTINGS.SERVER_DOMAIN = '127.0.0.1:5001';
SETTINGS.SERVER_URL = 'http://' + SETTINGS.SERVER_DOMAIN;


SETTINGS.PACKAGE_ROOT = __dirname;
SETTINGS.DATA_DIR = path.join(SETTINGS.PACKAGE_ROOT, 'data');

SETTINGS.VALID_BUNDLES = [
  'com.example.testApp'
];

module.exports = extend(BASE_SETTINGS, SETTINGS);
```

## client upload script

There is an example of a .ipa upload script in `client/` which can be used to automate the upload of a package, along with version information.

example use:

```
node upload.js --version="1.0" --build="1" --package="1.0.1" --bundle="com.example.testApp" --ipapath="path to ipa file"
```