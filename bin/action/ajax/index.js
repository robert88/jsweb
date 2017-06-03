var indexSqlApi = require("../../dao/batis/rap.batis.index.js");
exports = module.exports = {
	"getCode":function (request,response,next) {
		next(indexSqlApi.getCode());
	},
	"insertCode":function (request,response,next) {
		
	}
};
