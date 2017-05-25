
var sqlApi = require("../rap.postgres.api.js");

var indexTable = {
	name:"t_user"
}
exports = module.exports  = {
	"select":function(){
		return sqlApi.select(indexTable);
	}
}