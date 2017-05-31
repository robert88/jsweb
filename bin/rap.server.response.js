var wakePromise = require("./rap.filesystem.promise.js");

var actionMap = require("./rap.server.response.action.js");

var filter = require("./rap.server.response.filter.js");

var mine = require("./rap.server.response.types.js");

var zlib = require("zlib");

var fs = require("fs");

var path = require("path");

var zlibMap = {

	"gzip": zlib.createGzip,
	"gunzip": zlib.createGunzip,
	"deflate": zlib.createInflate

};

function responseData(ret,request, response,type) {

	var zipType = rap.deflate ? "deflate" : "gzip";//response.headers['Content-Encoding'] undefined

	type = type|| "text/html";
	var headerOption={
		"X-Powered-By":"robert-rap-server",
		"Content-Type":type,
		"X-Powered-By":"rap_robert"
	}
	var zip = zlibMap[zipType]();

	//如果返回是json数据
	if (rap.type(ret) == "object") {
		rap.log("请求结果为json对象：", JSON.stringify(ret));
		//response.pipe( b );
		response.writeHead(200,headerOption);
		response.end(JSON.stringify(ret))
		//如果返回的是文件
	} else {
		var absolutePath = (rap.rootPath + "/" + rap.staticPath + "/" + ret).toURI();
		rap.log("请求结果为静态文件：", absolutePath);
		var acceptEncoding = request.headers["accept-encoding"];
		if (!acceptEncoding) {
			acceptEncoding = "";
		}
		if (acceptEncoding.match(new RegExp(zipType))) {
			rap.log("encoding by setting ", zipType);
			headerOption["Content-Encoding"] = zipType;
			response.writeHead(200, headerOption);
			wakePromise.writeStream(absolutePath, response, zip)
		} else if (acceptEncoding.match(/\bgzip\b/)) {
			rap.log("encoding by ", "gzip");
			headerOption["Content-Encoding"] = "gzip";
			response.writeHead(200, headerOption);
			wakePromise.writeStream(absolutePath, response, zlibMap["gzip"]())
		} else if (acceptEncoding.match(/\bdeflate\b/)) {
			rap.log("encoding by ", "deflate");
			headerOption["Content-Encoding"] = "deflate";
			response.writeHead(200, headerOption);
			wakePromise.writeStream(absolutePath, response, zlibMap["deflate"]())
		} else {
			rap.log("no encoding ");
			response.writeHead(200, headerOption);
			wakePromise.writeStream(absolutePath, response)
		}
	}

}



exports = module.exports = function (request, response) {

	var ret;

	var url = filter(request.url, request.params) || request.url;

	var extname = path.extname(url).replace(".","");

	//匹配action文件
	if (actionMap[url]) {
		if (typeof actionMap[url] == "function") {
			var timer = setTimeout(function () {
				throw "response timeout";
			},600000);
			actionMap[request.url](request, response, function (ret) {
				clearTimeout(timer);
				responseData(ret,request, response,"application/json");
			});
		} else {
			ret = actionMap[url];
			responseData(ret,request, response,mine[extname]);
		}

	//静态文件
	}else if (mine[extname]) {

		ret = url;

		responseData(ret, request,response,mine[extname]);

	//不支持的文件类型
	}else {
		throw Error("not support resource of ",mine[extname]);
	}


}