var config = require("./config.js");
var wake = require("../toolLib/fileWake.js");
require("../toolLib/prototype.js");
var pg = require("pg");
var Promise = require("promise");

function _Base() {}//构造函数

/*
*连接串在config中配置
* 连接数据库
* */

_Base.prototype._connect = function () {
	return new Promise(function(resolve,reject){
		var connectStr = config.connectString;
			pg.connect(connectStr, function (err, client, done) {
			if (err) {
				reject(err);
			} else {
				resolve({client: client, done: done});
			}
		});
	});
};

/**
 * 缓冲数据库表结构
 * 根据创建表的结构来得到表的数据结构
 *
 * */
var cache = (function () {
	var obj = {};
	var files = wake.findFile("./sql/","sql");

	files.forEach(function (idx,file) {
		//读取文件
		var fileText = wake.readData(file);

		//每一行分割
		var fileTextArr = fileText.split(/\n|\r/);

		//去掉注释
		fileTextArr.forEach(function (val,idx) {
			fileTextArr[idx] = val.replace(/--.*/,"");
		});

		//统一性空格
		fileTextArr = fileTextArr.join(" ").replace(/\s+/g, " ");

		//获取表名和属性
		var reg = /\s*create\s*table\s*(\S+)\s*\((.*)\);?/g;
		var regMatch = reg.exec(fileTextArr);

		if(regMatch){
			var tempTable = obj[regMatch[1]] = {};
			var attrs=regMatch[2].split(",");
			attrs.forEach(function (val) {
				var arr = val.trim().split(/\s+/);
				var tempAttr = tempTable[arr[0]] = {};
				tempAttr.type = arr[1].replace(/\(.*\)/,"");
				tempAttr.limit = arr[1].match(/\(.*\)/g)?arr[1].match(/\(.*\)/g)[0].trim().replace(/\(|\)/g,""):arr[2]?arr.slice(2).join(" "):"";
			})
		}else{
			console.log("can not match file:",file)
		}
	});

	return obj;
})();
/*
*
* 单表模式是复合表模式去掉tables，且没有name
* 每个表都有个nameID，
* 没有result会已表名_字段名返回
*
* 复合表模型
* {
* 	tables:[表1，表2],
* 	tablesOptions:{
* 		joinType:"inner join",//"left join","full join","right join"//function
*		condition:表1.表1属性 && || >= > < <= = 表2属性//function
* 	}
* condition:复合表的条件
* order:顺序
* result:{
*  name:aliasName,//as
*  name:true,
*  aliasName:表达式
* }
* nameID:
* name:表名
* }
* */
var uid=0;
function getTableID(){
	return "t"+(uid++);
}

function createTableOpts(opts){
	if(opts.nameID==null){
		opts.nameID = getTableID();
	}
	opts.selectName = opts.name + " " + opts.nameID;
	var key;
	if(cache[opts.name]){
		var database = cache[opts.name];
		var result = [];
		var tempResult = Object.create(opts.result);

		if(opts.result!=null&&typeof opts.result=="object"){
			for( key in database){
				//取别名
				if(typeof tempResults[key]=="string"){
					result.push(opts.nameID+"."+key+" as "+tempResult[key]);
					delete tempResult[key];
				//不取别名但需要返回
				}else if(result[key]){
					result.push(opts.nameID+"."+key);
					delete tempResult[key];
				}
			}
			//不在database里面，这里一定要设置为函数后者其他表达式
			for(key in tempResult){
				result.push(key+" as "+tempResult[key]);
			}
		}else{
			//返回全部字段
			for( key in database){
				result.push(opts.nameID+"."+key);
			}
		}
	}
	opts.selectResult = result.join(",");

	if(typeof opts.condition=="function"){
		opts.selectCondition = opts.condition(opts.nameID );
	}else{
		opts.selectCondition = opts.condition||"";
	}
	for( key in database){
		var tempReg = RegExp("\\b"+key+"\\b","gi");
		var tempReg2 = RegExp("\\b\\."+key+"\\b","gi");
		if(!tempReg2.test(opts.selectCondition)){
			opts.selectCondition=opts.selectCondition.replace(tempReg," "+opts.nameID+"."+key+" ")
		}
		tempReg2.lastIndex = 0;
		if(!tempReg2.test(opts.selectOrder)){
			opts.selectOrder=opts.selectOrder.replace(tempReg," "+opts.nameID+"."+key+" ")
		}
		result.push(opts.nameID+"."+key);
	}
	return opts;
}

function createSQLstr(opts) {


	if( !opts.tables || !opts.name ){
		console.log("invalid table sql option",opts.name||opts.nameID);
		return "";
	}

	if(opts.tables){
		var tables = opts.tables;
		var tablesOptions = opts.tablesOptions;
		var joinType = tablesOptions.joinType;
		var selectNames=[];

		for(var i=0;i<tables.length;i++){

			if(!opts.selectName){
				selectNames.push(getTableName(tables[i]||opts).selectName);
			}else{
				selectNames.push(opts.selectName);
			}
			tables[i].result
			opts.selectItems = selectNames;
		}

		if(typeof joinType=="string"){
			selectNames = selectNames.join(joinType)
		}else if(typeof joinType=="function"){
			selectNames = joinType(selectNames);
		}else{
			selectNames = selectNames.join(",")
		}
		opts.selectName = selectNames;
		opts.selectItems = selectNames;
	}else{
		opts.selectName = opts.name + " " opts.nameID;
	}

	return "(select {0} from {1} where 1=1 {2}) {3}".tpl(items,opts.selectName,conditions,resultName);
}
_Base.prototype.select = function (opts) {


	var sqlStr = createSQLstr();

	if(!sqlStr ){
		console.log("cant find this table:".red,tablename);
		return new Promise(function(resolve,reject){reject()});
	}
	return this.query(sqlStr).then(function (queryResult) {
		console.log("qu:",queryResult);
		var ret = [];

		//返回的结果从alias中取得
		if(typeof alias=="object"){
			queryResult.rows.forEach(function (val,idx) {
				var temp = {};
				for(var key in val){
				//如果是字符串表示返回的别名
						if(typeof alias[key]=="string"){
						temp[alias[key]] = val[key];
							//如果定义的是bool值,表示返回结果中包含了改值
					}else if(alias[key]){
						temp[key] = val[key]
					}
				}
				ret.push(temp);
			})
			return ret;
		}else{
			return queryResult.rows;
		}

	});

}
_Base.prototype.query = function (sql, params, callback) {
	if (typeof params == 'function') {
		callback = params;
		params = [];
	}
	if (!params) {
		params = [];
	}
	if (!sql) {
		var err = new Error("sql is empty!");
		return new Promise(function (resolve,reject) {
			reject(err).nodeify(callback);
		});
	}

	//是否打印SQL语句
	if (config.sqldebug) {
		console.log('[SQL:]', sql, '[:SQL]');
		console.log('[PARAMS:]', params, '[:PARAMS]');
	}
	return this._connect()
		.then(function (connectResult) {
			var client = connectResult.client;
			var done = connectResult.done;
			return new Promise(function (resolve,reject) {
				client.query(sql, params, function (err, queryResult) {
					done();
					if (err) {
						reject(err);
					} else {
						if(typeof queryResult!="object"){
							resolve({rows:[]});
						}else{
							resolve(queryResult);
						}
					}
				})
			});
		})
		.nodeify(callback);
};

module.exports = _Base;/**
 * Created by 84135 on 2017/2/19.
 */
