/*
*
* @title：rap框架
* @author：尹明
*
* */
process.env.DEBUG =true;
global.rap = {};
rap.debug_module = true;
rap.requestStack = [];//过滤request
rap.rootPath="D:/newProject/jsweb/bin";

if(process.env.DEBUG){
	rap.staticPath="/static_src";//debugger静态资源路径
}else{
	rap.staticPath="/static";//静态资源路径
}

rap.actionPath="/action";//ajax请求路径或者是拦截url
rap.deflate = false;//deflate gzip压缩
rap.perTool={
	spaIndex:"/static_src/index.html",
	normalIndex :"/static_src/indexStatic.html",
	html:"/static_src/web",
	publicFile:"/static_src/public",
	buildRegExp:{exe:/\/static_src\//,str:"/static/"}
}
require('./rap.util.prototype.js');
require('./rap.util.tool.js');
require('./rap.util.module.js');
require("./rap.util.color.js");
require("./rap.util.timeout.js");
require("./rap.server.debug");

