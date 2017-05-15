var path = require('path');
var express = require('express');
var router = express.Router();
var angularBuildPath = path.resolve(__dirname, '../../my-angular4-project/dist');

router.use(express.static(angularBuildPath));

router.get('*', (req, res, next) => {
	if (req.url.startsWith('/api')) return next();
	res.sendFile(path.join(angularBuildPath, 'index.html'));
});

module.exports = router;