var resource = require('resource-router-middleware');

module.exports = function(resourceId, store) {

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
      res.json(store);
    },

    read : function(req, res) {
      res.json(req[resourceId]);
    },

    create : function(req, res) {
      var item = req.body;
      item.id = store.length.toString(36);
      store.push(item);
      res.json(item);
    },

    update : function(req, res) {
      var id = req.params[resourceId];
      find(id, function(item, i) {
        if (item) {
          Object.assign(store[i], req.body);
          store[i].id = id;
          return res.status(204).send('Accepted');
        } else {
          res.status(404).send('Not found');
        }
      });
    },

    delete : function(req, res) {
      var id = req.params[resourceId];
      var itemPosition = find(id, function(item, i) {
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