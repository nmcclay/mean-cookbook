var Post = require('./models/posts');
var env = process.env.NODE_ENV || 'development';

var generateMock = function(model, count, generateFake) {
  console.log("purging all " + model.modelName + "...");
  model.deleteMany({}, function() {
    let mocks = [];
    for (var i=0; i < count; i++) {
      mocks.push(generateFake());
    }

    model.insertMany(mocks, function (error, docs) {
      if (error) return console.error('Failed to create mock ' + model.modelName);
      console.log(count + " mock " + model.modelName + " created");
    });
  });
};

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/mean-db').then(function() {
  if (env == 'development') {
    var faker = require('faker');
    generateMock(Post, 30, function() {

      var markdown = faker.lorem.sentences();
      markdown += "## " + faker.lorem.sentence() + "\n";
      markdown += "[" + faker.lorem.words() + "](" +  faker.internet.url() + ")\n";

      return {
        title: faker.lorem.words(),
        content: markdown,
        published: faker.date.past()
      }
    });
  }
}, function(error) {
  console.error('failed to connect to MongoDB...', error);
});

module.exports = mongoose.connection;