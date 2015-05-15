'use strict';

var getenv = require('getenv');
var config = {};

config.mandrill = {};
config.email = {};

// mnadrill api key
config.mandrill.api_key = getenv('MANDRILL_API_KEY');
config.email.from = getenv('EMAIL_FROM',"notifications@linchpin.io");

module.exports = config;
