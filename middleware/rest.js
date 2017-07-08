var resource = require('resource-router-middleware');
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
var JSONAPIError = require('jsonapi-serializer').Error;

module.exports = function(resourceId, store, serialize, deserialize) {
  var serializer = new JSONAPISerializer(resourceId, serialize);
  var deserializer = new JSONAPIDeserializer(deserialize);

  var apiError = function(status, title, description) {
    return new JSONAPIError({
      status: status,
      title: title,
      detail: description
    });
  };

  var deserializeError = function(error) {
    error = error || {};
    return apiError(400, error.title || "Invalid Request Format", error.detail || "Requests must use JSON API format.");
  };

  var storeError = function(error) {
    error = error || {};
    return apiError(400, error.name || "Database Request Failed", error.message || "Unable to handle requested database operation.");
  };

  var fileNotFound = function(id) {
    return apiError(404, 'Not found', 'Resource ' + id + ' does not exist.');
  };

  return resource({
    id : resourceId,

    load : function(req, id, callback) {
      store.findById(id, function(error, item) {
        if (error) return callback(storeError(error));
        if (!item) return callback(fileNotFound(id));
        callback(null, item);
      });
    },

    list : function(req, res) {
      store.find({}, function(error, items) {
        if (error) return res.status(400).json(storeError(error));
        res.json(serializer.serialize(items));
      });
    },

    read : function(req, res) {
      res.json(serializer.serialize(req[resourceId]));
    },

    create : function(req, res) {
      try {
        deserializer.deserialize(req.body).then(function(item) {
          var doc = new store(item);
          doc.save(function(error, savedDoc) {
            if (error) return res.status(400).json(storeError(error));
            res.json(serializer.serialize(savedDoc));
          });
        })
      } catch(error) {
        return res.status(400).json(deserializeError(error));
      }
    },

    update : function(req, res) {
      var id = req.params[resourceId];
      try {
        deserializer.deserialize(req.body).then(function(itemReplace) {
          var doc = new store(itemReplace).toObject();
          delete doc._id;
          store.update({ _id: id }, doc, { upsert: true, overwrite: true }, function(error) {
            if (error) return res.status(400).json(storeError(error));
            res.status(204).send();
          });
        });
      } catch(error) {
        return res.status(400).json(deserializeError(error));
      }
    },

    modify: function(req, res) {
      var id = req.params[resourceId];
      try {
        deserializer.deserialize(req.body).then(function(itemModify) {
          store.update({ _id: id }, itemModify, function(error) {
            if (error) return res.status(400).json(storeError(error));
            res.status(204).send();
          });
        })
      } catch(error) {
        return res.status(400).json(deserializeError(error));
      }
    },

    delete : function(req, res) {
      var id = req.params[resourceId];
      store.remove({ _id: id }, function (error) {
        if (error) return res.status(400).json(storeError(error));
        res.status(204).send();
      });
    }
  });
};