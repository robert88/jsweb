/*
 * 清除两边的空白
 *
 * */
String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/, "");
};
/*
 * 数字转字符串
 *
 * */
String.prototype.tpl = function () {
	var arg = arguments;
	var that = this;
	for (var i = 0; i < arg.length; i++) {
		that = that.replace(new RegExp('\\{' + i + '\\}', "g"), arg[i]);
	}
	return that;
};
/*
 * 判断非空对象
 * */
function isUnEmptyObject(obj) {
	return obj != null && typeof obj == "object"
}
/*
 * 类型代理函数
 * */
function proxyHander(proxy, objectCallback, nullCallback) {
	if (typeof proxy == "function") {
		return proxy.call(this);
	} else if (isUnEmptyObject(proxy)) {
		return objectCallback.call(this, proxy)
	} else if (typeof proxy == "string") {
		return proxy;
	} else if (typeof nullCallback == "function") {
		return nullCallback.call(this);
	}
	return "";
}

/*
 * 数据库对象
 * */
var cache = {
	t_user: {
		qq: {type: "int", limit: "13"},
		nickname: {type: "int", limit: "13"},
		age: {type: "int", limit: "13"},
		id: {type: "int", limit: "13"},
		email: {type: "int", limit: "13"}
	}
};
/*
 * 字符串变成树形结构
 * */
function strToTree(str, obj, innerRegExp, prevSpread, nextSpread) {
	innerRegExp.lastIndex = 0;
	obj = obj || {};
	if (!innerRegExp.test(str)) {
		obj.children = [];
		obj.originStr = str;
		return obj;
	}
	var startIndex, endIndex;
	if (typeof prevSpread == "function") {
		startIndex = prevSpread(startIndex, str)
	}
	var ret = [];
	var topStr = str.replace(innerRegExp, function (m, index) {
		ret.push({text: m, start: index});
		return "";
	})
	obj.children = ret;
	obj.originStr = str;
	innerRegExp.lastIndex = 0;
	return strToTree(topStr, {subTree: obj}, innerRegExp, prevSpread, nextSpread)
}

/*
 * 树形结构变成字符串
 * */
function treeToStr(tree, originStr) {
	if (tree.subTree) {
		for (var i = 0; i < tree.children.length; i++) {
			var item = tree.subTree.children[i];
			originStr = originStr.slice(0, item.start) + item.text + originStr.slice(item.start, originStr.length)
		}
	}
	return treeToStr(tree.subTree, originStr)
	return originStr;
}
/*
 *
 * 查询条件
 * */
var ConditionTool = {
	parseCondition: function () {
		this.selectCondition = proxyHander.call(this,
			this.config.condition,
			function (condition) {
				return this._mergeCKey(condition);
			}, function () {
				return this._selectCondition.join(" and ")
			}
		)
	},
	_parseCKeyByObject: function (mergeType,  leftKey,rightObject) {
		if (rightObject.right != null) {
			return this._parseCKeyString(mergeType, leftKey, rightObject.right, rightObject.exec)
		} else {
			console.log("this condition item: ", key, "is object; but exec can not find")
			return ""
		}
	},
	_parseCKeyString: function (mergeType, leftKey, rightKey, exec) {
		var $rightKey = this.to$Key(rightKey)[0];
		if(this.database[$rightKey]){
			return "{0} {1} {2} {3} ".tpl(mergeType, this.toTidKey(leftKey)[0], exec || "=", this.toTidKey($rightKey)[0])
		}else if(this.database[leftKey].type=="int"){
			return "{0} {1} {2} {3} ".tpl(mergeType, this.toTidKey(leftKey)[0], exec || "=", rightKey*1)
		}else{
			return "{0} {1} {2} '{3}' ".tpl(mergeType, this.toTidKey(leftKey)[0], exec || "=", rightKey.replace(/'/g,""))
		}

	},
	_parseCKey: function (mergeType, leftKey, rightKey) {
		if (isUnEmptyObject(rightKey)) {
			return this._parseCKeyByObject(mergeType, leftKey, rightKey)
		} else {
			return this._parseCKeyString(mergeType, leftKey, rightKey)
		}
	},
	_mergeCKey: function (condition) {
		var defaultType = condition.defaultType || "and"
		var ret = [];
		var i = 0;
		var type = "";
		for (var key in condition) {
			if (key == "defaultType") {
				continue;
			}
			var $key = this.to$Key(key)[0];
			if (i == 0) {
				i++
			} else {
				type = (condition[key] && condition[key].type) || defaultType
			}
			if (this.database[$key]) {
				ret.push(this._parseCKey(type, $key, condition[key]));
			} else {
				console.warn("[nameID:", this.nameID, "]", "condition:{" + key + ":" + condition[key] + ",} is not valid!")
			}
		}
		return ret.join(" ");
	}
};
/*
 *
 * 设置config和nameID相关操作
 * */
var SettingsTool = {
	uid: 0,
	$init: function (config) {
		this.config = ix.extend(true, {}, config);
		this.initNameID();
		this.name = this.config.name;
	},
	getTid: function () {
		return "t" + (SettingsTool.uid++);
	},
	initNameID: function () {
		if (this.nameID == null) {
			this.nameID = this.getTid();
		}
	},
	getNameID: function (idx) {
		var tables = this.config.tables;
		if (tables) {
			if (this.cells[idx]) {
				return this.cells[idx].nameID
			} else {
				console.error("can not find tables by index is", idx);
				return "";
			}
		} else {
			return this.nameID
		}
	}
};
/*
 *
 * 返回字段
 * */
var ResultTool = {
	parseResult: function () {
		this.selectResult = proxyHander.call(this,
			this.config.result,
			function (result) {
				return this._mergeRKey(result);
			}, function () {
				return this.returnDatabase()
			}
		)
	},
	_parseRKey: function ($key, retKey) {
		if (!retKey) {
			console.warn("[nameID:", this.nameID, "] baseKey", $key, "==false")
			return ""
		}
		if (!/\s*\$\d+\.\S+\s*/.test($key)) {
			console.error("[nameID:", this.nameID, "] baseKey", $key, "==false")
			return ""
		}
		var tablesIndex;
		var baseKey;
		$key.replace(/\s*\$(\d+)\..*/, function (m, m1) {
			tablesIndex = m1 * 1
		});
		$key.replace(/\s*\$\d+\.(\S+)\s*/, function (m, m1) {
			baseKey = m1
		});
		var nameID = this.getNameID(tablesIndex);
		if (typeof retKey != "string") {
			retKey = baseKey
		}
		return "{0}.{1} as {2}".tpl(nameID, baseKey, retKey)
	},
	_parseRFuncKey: function (retKey, funcKey) {
		var params = this.toTidKey(funcKey);
		var func = this.getFuncName(funcKey)
		return "{0}({1}) as {2}".tpl(func, params, retKey)
	},
	_mergeRKey: function (result) {
		var ret = [];
		for (var key in result) {
			var $key = this.to$Key(key)[0];
			var value = result[key];
			//数据表中是否存在
			if (this.database[$key]) {
				//database是函数
				if(this.database[$key].value && ~this.database[$key].value.indexOf("(") ){
					ret.push(this._parseRFuncKey(key, this.database[$key]));
				}else{
					ret.push(this._parseRKey($key, value));
				}

			//是否是函数
			} else if (typeof value == "string" && ~value.indexOf("(")) {
				ret.push(this._parseRFuncKey(key, value));
			} else {
				console.warn("[nameID:", this.nameID, "]", "result:{" + key + ":" + value + ",} is not valid!")
			}
		}
		return ret.join(",")
	}
};

/*
 *
 * 排序条件
 * */
var OrderTool = {
	parseOrder:function () {
		this.selectOrder = proxyHander.call(this,
			this.config.order,
			function (order) {
				return this._mergeOKey(order);
			}
		)
	},
	_mergeOKey:function (order) {
		var ret = [];
		for(var key in order){
			var $key = this.to$Key(key)[0];
			if(this.database[$key]){
				ret.push(this._parseOKey($key,order[key]))
			}else{
				console.warn("[nameID:", this.nameID, "]", "order:{" + key + ":" + order[key] + ",} is not valid!")
			}
		}
		return ret.join(",")
	},
	_parseOKey:function ($key,value) {
		if(value=="asc" || value=="desc"){
			return this.toTidKey($key)+" "+value;
		}else if(value){
			return this.toTidKey($key)+" asc";
		}else{
			return this.toTidKey($key)+" desc";
		}
	}
};

/**
 *基础表相关方法
 */
ix.registerModule({
	moduleName: "Table",
	$init: function () {
		this.selectResult= "";
		this.selectCondition= "";
		this.selectOrder="";
		this.selectSql = "";
		this.selectName = "";
		this.cells=[];
		this._selectResult=[];
		this._selectCondition=[];
		this._selectOrder=[];
		this.database={};
		this.setJoinType();
		this.$ready.push(this.initDatabase, this.parseResult, this.parseCondition, this.parseOrder, this.toSql);
	},
	setJoinType: function () {
		this.joinType = this.config.joinType || ","
	},
	getParamStr: function (key) {
		key = key.replace(/\w+\s*\(([^)]+)\)\s*/g, function (m, m1) {
			return m1;
		})
		return key
	},
	toTidKey: function (key) {
		var keys = [];
		var that = this;
		key = this.getParamStr(key);
		key.replace(/[\w.$]+/g, function (m) {
			var idx = 0;
			if (/\s*\$(\d+)\.\S+\s*/.test(m)) {
				idx = RegExp["$1"] * 1
			}
			m = m.replace(/[\w$]+\.([\w$]+)/g, function (t, t1) {
				return t1;
			})
			keys.push("{0}.{1}".tpl(that.getNameID(idx), m))
		});
		return keys
	},
	to$Key: function (key) {
		var keys = [];
		key = this.getParamStr(key);
		key.replace(/[\w\.\$]+/g, function (m) {
			if (m.indexOf(".") == -1) {
				m = "$0." + m
			}
			keys.push(m)
		})
		return keys;
	},
	toKey: function (key) {
		var keys = [];
		key.replace(/[\w.$]+/g, function (m) {
			m = m.replace(/[\w$]+\.([\w$]+)/g, function (t, t1) {
				return t1;
			})
			keys.push(m)
		});
		if (keys.lenght > 1) {
			console.log("param key must single key")
		}
		return keys;
	},
	getFuncName: function (key) {
		return key.replace(/(\w+)\s*\(([^)]+)\)\s*/g, "$1");
	},
	returnDatabase: function () {
		var ret = [];
		for (var key in this.database) {
			if( this.database[key].value && ~this.database[key].value.indexOf("(") ){
				ret.push("{0} as {1}".tpl(this.database[key].value, this.toKey(key)[0]))
			}else{
				ret.push("{0} as {1}".tpl(this.toTidKey(key)[0], this.toKey(key)[0]))
			}

		}
		return ret.join(",")
	},
	initDatabase: function () {
		console.log("no database")
	},
	toSql: function () {
		if (!this.selectName || !this.selectResult) {
			this.selectSql = "";
		} else {
			this.selectSql = "select {0} from {1} {2} {3}".tpl(this.selectResult, this.selectName,
				(this.selectCondition ? (" where " + this.selectCondition) : ""),
				(this.selectOrder ? (" order by " + this.selectOrder) : "")
			)
		}
	}

}, SettingsTool, ResultTool, ConditionTool, OrderTool);
/**
 * 复合表的相关操作
 */
ix.registerModule({
	moduleName: "ComplexTable",
	$init: function () {
		this._parseCells();
		this.$ready.push(this.setWrapName);
	},
	setWrapName: function () {
		this.wrapName = "(" + this.selectSql + ") " + this.nameID;
	},
	initDatabase: function () {
		if (this._selectResult.length != this.config.tables.length) {
			console.error("_selectResult 的长度必须和table保持一致");
			return ""
		}
		for (var j = 0; j < this._selectResult.length; j++) {
			var arr = this._selectResult[j].split(",");
			for (var i = 0; i < arr.length; i++) {
				if (!(arr[i] = arr[i].trim())) {
					continue
				}
				var t = arr[i].split(/\bas\b/);
				var key = t && t[1];
				if (key) {
					key = key.trim();
					//保存函数,通过database.value=来传递函数
					if(~t[0].indexOf("(")){
						this.database["$" + j + "." + key] = {value:t[0],type:"any",nameID:this.getNameID(j)};
					}else{
						this.database["$" + j + "." + key] = {nameID:this.getNameID(j)};
					}

				} else {
					console.error(".initDatabase:subTable selectResult must format:key as value")
				}
			}
		}
	},
	_parseCells: function () {
		var selectNameTpl = [];
		this.cells = [];
		for (var i = 0; i < this.config.tables.length; i++) {
			var itemConfig = this.config.tables[i];
			var itemTable = new SQL(itemConfig);
			this.cells[i] = itemTable;
			var joinType = itemTable.joinType;
			if (itemTable.wrapName) {
				if (selectNameTpl.length == 0) {
					selectNameTpl.push(itemTable.wrapName)
				}else {
					selectNameTpl.push(joinType, itemTable.wrapName)
				}
			}
			this._selectResult.push(itemTable.selectResult);
			itemTable.selectCondition&&this._selectCondition.push(itemTable.selectCondition);
			itemTable.selectOrder&&this._selectOrder.push(itemTable.selectOrder);

		}
		this.selectName = selectNameTpl.join(" ")
	}
}, ix.module.Table);
/**
 * 单表相关操作
 */
ix.registerModule({
	moduleName: "SingleTable",
	$init: function () {
		if (this.name&&cache[this.name]) {
			this.wrapName = this.name + " " + this.nameID
		}
	},
	initDatabase: function () {
		if (this.name&&cache[this.name]) {
			for (var key in cache[this.name]) {
				this.database["$0." + key ] = cache[this.name];
			}
			return ""
		} else {
			console.error(".tableID:", this.nameID, " cant find table in cache:", this.name)
		}
	},
}, ix.module.Table);

/**
 * SQL对象
 */
function SQL(config) {
	if (config.tables) {
		return new ix.module.ComplexTable(config)
	} else {
		return new ix.module.SingleTable(config)
	}
}