var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./routes/api');
var angular = require('./routes/angular');
var session = require('./routes/session');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.cookieSecret));
app.use(session);
app.use('/', angular);
app.use('/api', api);
app.use(function(req, res) {
  var error = new Error('Not Found');
  res.status(404).json({
    status: 404,
    message: error.message,
    name: error.name
  });
});

module.exports = app;