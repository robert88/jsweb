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
		headers:function(set){
			var headers = {};
			for(var i=0;i<set.rawHeaders.length;i+=2){
				headers[set.rawHeaders[i]] = set.rawHeaders[i+1];
			}
			return headers;
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

	//将头部信息装到request

	for(var j in obj.headers){
		obj[j] = obj.headers[j];
	}

	obj.headers = null;

	if (obj.method== 'POST') {
		rap.log("post");
		//可能数据很大时候，需要用代理
		var postBuffer = [];
		/**
		 * 因为post方式的数据不太一样可能很庞大复杂，
		 * 所以要添加监听来获取传递的数据
		 * 也可写作 req.on("data",function(data){});
		 */
		req.addListener("data", function (data) {
			postBuffer.push(data);
		});
		/**
		 * 这个是如果数据读取完毕就会执行的监听方法
		 */
		req.addListener("end", function () {
			obj.params = qs.parse(postBuffer.join(""));

			paramsTypeConvert(obj.params);

			callback(obj);
		});
	}
	else if (obj.method == 'GET') {
		rap.log("get");
		/**
		 * 也可使用var query=qs.parse(url.parse(req.url).query);
		 * 区别就是url.parse的arguments[1]为true：
		 * ...也能达到‘querystring库’的解析效果，而且不使用querystring
		 */
		obj.params = url.parse(req.url, true).query;

		paramsTypeConvert(obj.params);

		callback(obj);
	} else {
		rap.log("other require");
		callback(obj);
	}
};
/**
 * 参数类型转换
 * */
function paramsTypeConvert(params){
	//bool值的
	for(var k in params){
		if(params[k]==="true"){
			params[k]=true;
		}else if(params[k]==="false"){
			params[k]=false;
		}
	}
}

