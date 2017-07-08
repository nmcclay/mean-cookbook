var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/mean-db');

var mongo = mongoose.connection;
var db = mongo.db;
mongo.on('error', console.error.bind(console, 'failed to connect to mongodb:'));
mongo.once('open', function() {
  console.log('connected to mongodb!');
  db.collection('posts').count().then(function(count) {
    console.log("post count: " + count);
  });
});

module.exports = db;