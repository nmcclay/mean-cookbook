var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var api = require('./routes/api');
var angular = require('./routes/angular');
var auth = require('./middleware/auth');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.cookieSecret));
app.use(session({
  secret: process.env.cookieSecret,
  resave: false,
  saveUninitialized: true
}));
app.use('/admin', auth.setRole('admin'));
app.use('/user', auth.setRole('user'));
app.use('/', angular);
app.use('/api', auth.requireRole('admin'), api);
app.use(function(req, res) {
  var error = new Error('Not Found');
  res.status(404).json({
    status: 404,
    message: error.message,
    name: error.name
  });
});

module.exports = app;