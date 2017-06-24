var express = require('express');
var router = express.Router();
var posts = require('./api/posts');
var auth = require('../middleware/auth');
var login = require('./api/login');
var images = require('./api/images');
var enforceContentType = require('enforce-content-type');
var jwt = require('jwt-express');
var env = process.env.NODE_ENV || 'development';

router.options('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

router.use(enforceContentType({
  type: ['application/json', 'multipart/form-data']
}));

router.get('/', function (req, res, next) {
  res.send('API is running');
});

router.use('/login', login);
router.use('/images', jwt.require('role', '===', 'admin'), images);
router.use('/posts', jwt.require('role', '===', 'admin'), posts);

router.get('/:param', function (req, res, next) {
  var params = req.params;
  var query = req.query;
  Object.assign(params, query);
  res.json(params);
});

if (env == 'production') {
  router.use(auth.unauthorized);
}

module.exports = router;
