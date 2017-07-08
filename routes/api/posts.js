var restFactory = require('../../middleware/rest');
var Posts = require('../../models/posts');

var serialize = {
  attributes: ['title', 'content', 'published', 'author'],

  author: {
    ref: function (user, author) {
      return author.id;
    },
    attributes: ['firstName', 'lastName', 'email']
  }
};

var deserialize = {
  keyForAttribute: 'dash-case'
};

module.exports = restFactory('posts', Posts, serialize, deserialize);