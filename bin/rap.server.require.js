var filter = require("./rap.server.require.filter.js");
var http = require('http');
//使request具备http服务


exports = module.exports = function (req) {
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
		}
	};
	for(var i in obj){
		if(typeof  obj[i]=="function"){
			obj[i] = obj[i](req);
		}else{
			obj[i] = req[i];
		}

	}

	return obj;
};

