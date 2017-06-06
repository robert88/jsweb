var filter = require("./rap.server.require.filter.js");
var http = require('http');
var url = require('url');
var qs =require("querystring");
//使request具备http服务


exports = module.exports = function (req,callback) {
	//统一初始化
	var obj = {
		httpVersion:null,
		method:null,
		params:null,
		url:function(set){
			return set.url.replace(/\?.*$/,"").replace(/#.*$/,"")
		},
		hash:function(set){
			return set.url.replace(/^[^?]*\?/,"").replace(/^.*#/,"");
		},
		search:function(set){
			return set.url.replace(/^[^?]*\?/,"")
		},
		headers:null,
		host:function (set) {
			return set.rawHeaders[1];
		},
		connection:function (set) {
			return set.rawHeaders[3];
		},
		userAgent:function (set) {
			return set.rawHeaders[7];
		},
		accept:function (set) {
			return set.rawHeaders[9];
		},
		acceptEncoding:function (set) {
			return set.rawHeaders[11];
		},
		method:function (set) {
			return set.method.toUpperCase();
		}
	};
	for(var i in obj){
		if(typeof  obj[i]=="function"){
			obj[i] = obj[i](req);
		}else{
			obj[i] = req[i];
		}
	}

	if (obj.method== 'POST') {
		rap.log("post");
		var postData = "";
		/**
		 * 因为post方式的数据不太一样可能很庞大复杂，
		 * 所以要添加监听来获取传递的数据
		 * 也可写作 req.on("data",function(data){});
		 */
		req.addListener("data", function (data) {
			postData += data;
		});
		/**
		 * 这个是如果数据读取完毕就会执行的监听方法
		 */
		req.addListener("end", function () {
			obj.params = qs.parse(postData);
			callback(obj);
		});;
	}
	else if (obj.method == 'GET') {
		rap.log("get");
		/**
		 * 也可使用var query=qs.parse(url.parse(req.url).query);
		 * 区别就是url.parse的arguments[1]为true：
		 * ...也能达到‘querystring库’的解析效果，而且不使用querystring
		 */
		obj.params = url.parse(req.url, true).query;
		callback(obj);
	} else {
		rap.log("other require");
		callback(obj);
	}
};

