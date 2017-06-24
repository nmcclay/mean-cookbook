var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIError = require('jsonapi-serializer').Error;

var images = [];

var serializer = new JSONAPISerializer('images', {
  id: 'filename',
  attributes: ['originalname', 'mimetype', 'path', 'size']
});

var coverUpload = function(req, res, next) {
  upload.single('cover')(req, res, function (err) {
    if (err) {
      return res.status(422).json(new JSONAPIError({
        status: 422,
        title: 'Image Upload Error',
        detail: err.message
      }));
    }
    next();
  });
};

router.post('/', coverUpload, function(req,res) {
  images.push(req.file);
  res.json(serializer.serialize(req.file));
});

module.exports = router;