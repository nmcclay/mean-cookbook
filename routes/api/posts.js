var restFactory = require('../../middleware/rest');

var posts = [{
  id: "123",
  title: string = "My First Blog Post",
  content: string = "... brevity is the soul of wit...",
  published: new Date(),
  author: {
    firstName: "Nicholas",
    lastName: "McClay",
    email: "nmcclay@nickmcclay.com"
  }
}];

module.exports = restFactory('posts', posts);