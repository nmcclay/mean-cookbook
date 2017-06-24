var cloudinary = require('cloudinary');
var JSONAPIError = require('jsonapi-serializer').Error;

cloudinary.config({
  cloud_name: process.env.cloudinaryCloudName,
  api_key: process.env.cloudinaryAPIKey,
  api_secret: process.env.cloudinaryAPISecret
});

var self = module.exports = {
  upload: function(image, options) {
    if (!options) options = {};
    return function(req, res, next) {
      cloudinary.v2.uploader.upload(image, options, function(error, result) {
        if (error) {
          return res.status(500).json(new JSONAPIError({
            status: 500,
            title: 'Cloudinary Upload Error',
            detail: error.message
          }));
        }
        req.cloudinary = result;
        next();
      });
    }
  },

  uploadFromFilePath: function(req, res, next) {
    if (req.file && req.file.path) {
      let path = req.file.path;
      return self.upload(path)(req, res, next);
    } else {
      return res.status(500).json(new JSONAPIError({
        status: 500,
        title: 'Invalid File Path',
        detail: 'There is no file path available to upload to Cloudinary.'
      }));
    }
  },

  uploadBuffer: function(buffer, options) {
    if (!options) options = { discard_original_filename: true };
    return function(req, res, next) {
      cloudinary.v2.uploader.upload_stream(options, function(error, result) {
        if (error) {
          return res.status(500).json(new JSONAPIError({
            status: 500,
            title: 'Cloudinary Upload Error',
            detail: error.message
          }));
        }
        req.cloudinary = result;
        next();
      }).end(buffer);
    }
  },

  uploadFromFileBuffer: function(req, res, next) {
    if (req.file && req.file.buffer) {
      let buffer = req.file.buffer;
      return self.uploadBuffer(buffer)(req, res, next);
    } else {
      return res.status(500).json(new JSONAPIError({
        status: 500,
        title: 'Invalid File Buffer',
        detail: 'There is no file buffer available to upload to Cloudinary.'
      }));
    }
  }
};