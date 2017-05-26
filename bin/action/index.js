var indexSqlApi = require("../dao/batis/rap.batis.index.js");

exports = module.exports = {
	"/":function (request,response,next) {
		 next(indexSqlApi.select());
	},
	"getCode":function (request,response,next) {
		console.log("getCode");
		next(indexSqlApi.getCode());
	},
	"getuser":function () {
		console.log("getuser");
	}
}