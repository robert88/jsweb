var filter = require("./rap.server.require.filter.js");
var http = require('http');
//使request具备http服务
var request ={ __proto__: http.IncomingMessage.prototype}

defineGetter(request,"host",function () {
	return this.rawHeaders[1];
});
defineGetter(request,"connection",function () {
	return this.rawHeaders[3];
});
defineGetter(request,"userAgent",function () {
	return this.rawHeaders[7];
});
defineGetter(request,"accept",function () {
	return this.rawHeaders[9];
});
defineGetter(request,"acceptEncoding",function () {
	return this.rawHeaders[11];
});


exports = module.exports = function (req) {
	//统一初始化
	var obj = {httpVersion:null,method:null,params:null,url:null,headers:null};
	for(var i in obj){
		obj[i] = req[i];
	}
	for (var key in request) {
		request[key] = req;
	}
	return obj;
};

/**
 * Helper function for creating a getter on an object.这个方法不用用同名的属性来获取，否则死循环
 *
 * @param {Object} obj
 * @param {String} name
 * @param {Function} getter
 * @private
 */
function defineGetter(obj, name, getter) {
	Object.defineProperty(obj, name, {
		configurable: true,
		enumerable: true,
		get: getter
	});
};
