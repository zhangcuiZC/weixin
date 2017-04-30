var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var echostr = req.query.echostr,
		result = "";
		
	if (!echostr) {
		result = responseMsg();
	}else{
		result = validate(req);
	}
	res.send(result);
	// res.render('index', { info: result });
});

function responseMsg(){
	return "zc";
}

function validate(req){
	var signature = req.query.signature,
		timestamp = req.query.timestamp,
		nonce = req.query.nonce,
		echostr = req.query.echostr,
		token = 'zhangcui',
		tmp_arr = [];
	tmp_arr = [token, timestamp, nonce].sort().join("");

	var crypto = require('crypto');
	var sha1 = crypto.createHash('sha1');
	var after_sha1 = sha1.update(tmp_arr).digest('hex');

	if (after_sha1 === signature) {
		// console.log('true!!!!');
		return echostr;
	}
}


module.exports = router;
