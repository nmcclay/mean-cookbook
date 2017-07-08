var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title:  String,
  content: String,
  published: { type: Date, default: Date.now }
});

module.exports = mongoose.model('post', postSchema);