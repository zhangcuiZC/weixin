var express = require('express');
var router = express.Router();
var xml2js = require('xml2js');

var parser = new xml2js.Parser({explicitArray: false});

router.use('/', function(req, res, next) {
	var echostr = req.query.echostr,
		result = "";
		
	if (!echostr) {
		responseMsg(req, res);
	}else{
		validate(req, res);
	}
});

function responseMsg(req, res){
	var _data;
	var res_xml;

	req.on('data', function(data) {
		_data = data.toString('utf-8');
	});
	req.on('end', function(){
		parser.parseString(_data, function(err, result) {

			var postObj = result.xml;
			var fromUsername = postObj.FromUserName,
				toUsername = postObj.ToUserName,
				type = postObj.MsgType,
				event = postObj.Event,
				time = Date.now(),
				contentStr = '';

			if (type === 'text') {
				var keyword = postObj.Content.replace(/^\s*|\s*$/g, '');
				switch(keyword) {
					case '百度':
						contentStr = "<a href='http://www.baidu.com'>百度一下，你就傻了</a>";
						break;
					case '测试':
						contentStr = "<a href='http://www.zhangcui.online/test'>测试地址</a>";
						break;
					case '图文':
						var arr = [
								{
									'title': '标题1',
									'description': '欢迎关注我的微信公众号',
									'picUrl': 'http://www.zhangcui.online/images/test_image1.jpg',
									'url': 'http://www.zhangcui.online/test'
								},
								{
									'title': '标题2',
									'description': '欢迎关注我的微信公众号',
									'picUrl': 'http://www.zhangcui.online/images/test_image2.jpg',
									'url': 'http://www.zhangcui.online/test'
								}
							];
						res_xml = responsePicAndText(fromUsername, toUsername, time, arr);
						res.send(res_xml);
						return false;
					default:
						contentStr = "不知道你在说些什么";
						break;
				}
			}else if (type === 'event' && event === 'subscribe') {
				var arr = [
						{
							'title': '欢迎关注！',
							'description': '欢迎关注我的微信公众号',
							'picUrl': 'http://www.zhangcui.online/images/test_image1.jpg',
							'url': 'http://www.zhangcui.online/test'
						}
					];
				res_xml = responsePicAndText(fromUsername, toUsername, time, arr);
				res.send(res_xml);
				return false;
			}else{
				contentStr = "";
			}

			res_xml = (`<xml>
							<ToUserName><![CDATA[${fromUsername}]]></ToUserName>
							<FromUserName><![CDATA[${toUsername}]]></FromUserName>
							<CreateTime>${time}</CreateTime>
							<MsgType><![CDATA[text]]></MsgType>
							<Content><![CDATA[${contentStr}]]></Content>
						</xml>`);

			res.send(res_xml);
		});
	});
}

function responsePicAndText(fromUsername, toUsername, time, arr) {
	var len = arr.length;
	var textTpl = `<xml>
						<ToUserName><![CDATA[${fromUsername}]]></ToUserName>
						<FromUserName><![CDATA[${toUsername}]]></FromUserName>
						<CreateTime>${time}</CreateTime>
						<MsgType><![CDATA[news]]></MsgType>
						<ArticleCount>${len}</ArticleCount>
						<Articles>`;
	for (var i = 0; i < len; i++) {
		textTpl += `<item>
						<Title><![CDATA[${arr[i].title}]]></Title>
						<Description><![CDATA[${arr[i].description}]]></Description>
						<PicUrl><![CDATA[${arr[i].picUrl}]]></PicUrl>
						<Url><![CDATA[${arr[i].url}]]></Url>
						</item>`;
	}
	textTpl += "</Articles></xml>";
	return textTpl;
}

function validate(req, res){
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
		res.send(echostr);
	}
}


module.exports = router;
