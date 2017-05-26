
var sqlApi = require("../rap.postgres.api.js");

exports = module.exports  = {
	"select":function(){
		return sqlApi.select({
			name:"t_user"
		});
	},
	getcode:function () {
	return sqlApi.select({
		name:"t_code"
	});
	},
	insertCode:function(opts){
		opts.name="t_code";
		return sqlApi.insert(opts)
	}
}