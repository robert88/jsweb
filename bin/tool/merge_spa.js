/*
* spa架构的打包工具
* */

var tool = require("./merge_config.js");

var parseHtml = require("./rap.parse.html.js");


/*
* 根据设置的首页来解析公共的部分，包括压缩
* */
var configJson = {};

;(function () {
	var indexFile = tool.getIndexPath();
	rap.info("解析首页文件",indexFile);
	parseHtml.parseIndex({
		indexFile:indexFile,
		configJson:configJson,
		mergeCssPath:"public/min/css",
		mergeJsPath:"public/min/js"
	});
}());


/*
 * 根据单页面合并css和js
 * */
;(function () {
	var pageFilePath = tool.getPageFilePath();
	rap.info("解析单页面文件：",pageFilePath);
	parseHtml.parseHtml({
		indexFileDir:pageFilePath,
		configJson:configJson,
		mergeCssPath:"public/min/css",
		mergeJsPath:"public/min/js"
	});
}());


/*
 * 拷贝静态文件
 * */
;(function () {
	var publicPath = tool.getPublicPath();
	rap.info("解析单页面文件：",publicPath);
	parseHtml.copy({
		staticPath:publicPath,
		configJson:configJson,
		mergeCssPath:"public/min/css",
		mergeJsPath:"public/min/js"
	});
}());

rap.info("已经生成打包记录json",configJson);