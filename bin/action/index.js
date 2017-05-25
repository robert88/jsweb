var indexSqlApi = require("../dao/batis/rap.batis.index.js");

exports = module.exports = {
	"/":function (request,response,next) {
		 next(indexSqlApi.select());
	},
	"getip":function () {
		console.log("getip");
	},
	"getuser":function () {
		console.log("getuser");
	}
}