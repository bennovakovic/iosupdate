'use strict';
var path = require('path');

var SETTINGS = {};

SETTINGS.DEBUG = false;
SETTINGS.CACHE_TEMPLATES = 'memory';
SETTINGS.SERVER_MODE = 'production';
SETTINGS.SERVER_DOMAIN = 'autogoats.com';
SETTINGS.SERVER_URL = 'http://' + SETTINGS.SERVER_DOMAIN;

SETTINGS.PACKAGE_ROOT = path.join(__dirname, '..');
SETTINGS.TEMPLATE_PATH = path.join(SETTINGS.PACKAGE_ROOT, 'templates');
SETTINGS.STATIC_CHECKOUT = path.join(SETTINGS.PACKAGE_ROOT, 'static');
SETTINGS.DATA_PATH = path.join(SETTINGS.PACKAGE_ROOT, 'data');
SETTINGS.STATIC_URL_PREFIX = '/static/';
SETTINGS.STATIC_PATH = path.join(SETTINGS.STATIC_CHECKOUT, 'app');
SETTINGS.SERVE_STATIC = false;

SETTINGS.SITE_TITLE = 'Carby';
SETTINGS.SITE_DESCRIPTION = 'Car app';

SETTINGS.DATA_DIR = path.join(SETTINGS.PACKAGE_ROOT, 'data');
SETTINGS.VALID_BUNDLES = [];
SETTINGS.BUNDLE_URL_INDEX = 0;

SETTINGS.IOS_APP_EXTENSION = '.ipa';

module.exports = SETTINGS;
