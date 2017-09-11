/*
*
* @title：rap框架
* @author：尹明
*
* */
var childProcess = require('child_process');
var startTime = new Date();

require("./rap.util.core.config.js");
require("./dao/rap.sql.cache.js");

var requestFilter = require("./rap.server.require.js");
var handleResponse = require("./rap.server.response.js");

var domain = require('domain');

var http = require("http");

var requestCount = 0;
//报错的时候要清除掉
var responseCache = [];

function requestRecord(){


}

if(process.env.DEBUG){

	childProcess.exec('start "%windir%\\system32\\cmd.exe" node-inspector --web-port=8081',function (err,stdout) {
		if(err){
			rap.error(err);
		}else {
			rap.log("run debugger",stdout);
		}
	});
}
function clearNullAndFinished(filter){
	var newArr = [];
	for(var i=0;i<responseCache.length;i++){
		if(responseCache[i] && responseCache[i].finished==false){
			if(typeof filter=="function"){
				filter(responseCache[i]);
			}
			newArr.push( responseCache[i] );
		}
	}
	responseCache =  newArr;
}
/**
 * Create HTTP server.
 */
var server = http.createServer(function(req, response) {

	clearNullAndFinished();

	responseCache.push(response);

	var d = domain.create();

	d.run(function () {
		try{
		requestCount++;

		rap.log("累计请求",requestCount);

		//延时处理，节流
		rap.debounce(requestRecord,60000);

		requestFilter(req,function(request){
			//当前的url是外部域名，且指定要代理

			if(request.url.indexOf("http://") &&request.url.indexOf(request.host)==-1 && request.params.isProxy == true ){
				if (request.method == "POST") {

					if (request["Content-Type"] == "application/json") {
						http.request({
							method: "POST",
							hostname: request.params.ip,
							path: request.url,
							port:request.params.port,
							json: true,
							headers: {
								"content-type": request["Content-Type"]
							},
							body: JSON.stringify(request.params)
						}, function (proxyRes) {

						}).end()
					} else {
						http.request({
							method: "POST",
							hostname: request.params.ip,
							path: request.url,
							port:request.params.port,
							headers: {
								"content-type": request["Content-Type"]
							},
							form: request.params
						}, function (proxyRes) {

						}).end()
					}

				} else {
					http.request(request.url, function (proxyRes) {

					}).end()
				}

			}else{
				handleResponse(request,response);
			}

		});


		}catch (err){
			handlerErr(err,response,"trycatch")
		}
	});

	//捕获大部分异常
	d.on('error', function (err) {
		handlerErr(err,response,"domainErrorEvent")
	});



});

//处理
function handlerErr(err,response,name){

	rap.error(name,":",err.stack); // log the error

	if(err.stack.indexOf("no such file or directory")!=-1){
		response.writeHead(404);
		response.end();
	}else{
		response.writeHead(err.status||500);
		response.end(err.message);
	}

}
//捕获部分异常
process.on('uncaughtException', function (err) {

	// rap.error("uncaughtException:",err.stack); // log the error

	clearNullAndFinished(function(response){
		handlerErr(err,response,"uncaughtException");
		response=null
	});
	//try {
		//var killTimer = setTimeout(function () {
		//	process.exit(1);
		//}, 30000);
		//killTimer.unref();

		//server.close();
	//} catch (e) {
	//	rap.error('error when uncaughtException', e.stack);
	//}



});

server.listen(3000);
if(process.env.DEBUG){
	childProcess.exec('start C:\\"Program Files (x86)"\\Google\\Chrome\\Application\\chrome.exe http://localhost:3000',function (err,stdout) {
		if(err){
			rap.error(err);
		}else {
			rap.log("chrome run 3000");
		}
	});
}
var endTime = new Date();

rap.info("静态文件路径为",rap.staticPath,rap.rootPath+rap.staticPath);

rap.info("服务器启动在3000端口上,启动消耗",endTime-startTime,"ms");

