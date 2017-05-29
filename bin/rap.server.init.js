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

var http = require("http");

var requestCount = 0;

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

/**
 * Create HTTP server.
 */
var server = http.createServer(function(req, response) {
	try{

	requestCount++;

	rap.log("累计请求",requestCount);

	//延时处理，节流
	rap.debounce(requestRecord,60000);

	var request = requestFilter(req);

	handleResponse(request,response);

		
	}catch(e){
		rap.error(e.stack);
		// response.end();
	}

});

process.on('uncaughtException', function (err) {
	rap.error(err.stack); // log the error
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

