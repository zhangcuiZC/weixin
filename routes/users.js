var express = require('express');
var router = express.Router();

/* GET users listing. */
router.use('/', function(req, res, next) {
	console.log('test');
  res.render('index');
});

module.exports = router;
