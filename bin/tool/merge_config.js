
require("../rap.util.core.config.js");

rap.info("首页文件为：",rap.perTool.spaIndex,
	"输入资源路径：",rap.perTool.html,
	"输出资源路径：",replaceBulidPath(rap.perTool.html),
	"输入静态public文件",rap.perTool.publicFile,
	"输出静态public文件",replaceBulidPath(rap.perTool.publicFile));


exports = module.exports = function() {return this;};

/*
*
* 通过访问路径生成打包路径
* accentPath当前目录路径
*
* */


exports.getBulidPath = function(accentPath){
	//工具包到跟目录的访问路径，用于解析代码中的路径
	return (rap.rootPath +"/"+ replaceBulidPath(accentPath)).toURI();
};

function replaceBulidPath(accentPath){
	return accentPath.replace(rap.perTool.buildRegExp.exe,rap.perTool.buildRegExp.str)
}
/*
*
* 首页路径
*
* */
exports.getIndexPath = function (){
	return (rap.rootPath +"/"+rap.perTool.spaIndex).toURI();
};

/*
 *
 * 单页面路径
 *
 * */
exports.getPageFilePath = function (){
	return (rap.rootPath +"/"+rap.perTool.html).toURI();
};
/*
*
* 静态路径
*
* */

exports.getPublicPath = function(){
	return (rap.rootPath +"/"+rap.perTool.publicFile).toURI();

};
