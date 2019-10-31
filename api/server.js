const express = require('express');

const server = express();
require('../middleware')(server);
require('../routes')(server);
module.exports = server;
