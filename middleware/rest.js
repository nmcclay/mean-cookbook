var resource = require('resource-router-middleware');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

module.exports = function(resourceId, store, serialize, deserialize) {
  var serializer = new JSONAPISerializer(resourceId, serialize);
  var deserializer = new JSONAPIDeserializer(deserialize);

  var find = function(id, callback) {
    var itemPosition = store.map(function(item) {
      return item.id;
    }).indexOf(id);
    var item = store[itemPosition];
    if (item) {
      callback(item, itemPosition);
    } else {
      callback(false);
    }
  };

  return resource({
    id : resourceId,

    load : function(req, id, callback) {
      find(id, function(item) {
        if (!item) {
          callback('Not found');
        } else {
          callback(null, item);
        }
      });
    },

    list : function(req, res) {
      res.json(serializer.serialize(store));
    },

    read : function(req, res) {
      res.json(serializer.serialize(req[resourceId]));
    },

    create : function(req, res) {
      deserializer.deserialize(req.body).then(function(item) {
        item.id = store.length.toString(36);
        store.push(item);
        res.json(item);
      });
    },

    update : function(req, res) {
      var id = req.params[resourceId];
      find(id, function(item, i) {
        if (item) {
          deserializer.deserialize(req.body).then(function(itemReplace) {
            store.splice(i, 1);
            itemReplace.id = id;
            store.push(itemReplace);
            return res.status(204).send('Replaced');
          });
        } else {
          res.status(404).send('Not found');
        }
      });
    },

    modify: function(req, res) {
      var id = req.params[resourceId];
      find(id, function(item, i) {
        if (item) {
          deserializer.deserialize(req.body).then(function(itemUpdates) {
            Object.assign(store[i], itemUpdates);
            return res.status(204).send('Accepted');
          });
        } else {
          res.status(404).send('Not found');
        }
      });
    },

    delete : function(req, res) {
      var id = req.params[resourceId];
      find(id, function(item, i) {
        if (item) {
          store.splice(i, 1);
          return res.status(200).send('Deleted');
        } else {
          res.status(404).send('Not found');
        }
      });
    }
  });
};