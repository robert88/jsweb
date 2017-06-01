var pg = require("pg");
require("./rap.sql.js");

exports = module.exports = {
	/*
	 *连接串在config中配置
	 * 连接数据库
	 * */
	_connect: function () {
		return new Promise(function (resolve, reject) {
			var connectStr = rap.connectionString;
			rap.info("connect postgres", connectStr);
			pg.connect(connectStr, function (err, client, done) {
				if (err) {
					rap.error("connect postgres error", err&&err.message||err);
					reject(err);
				} else {
					rap.info("connect postgres success", client);
					resolve({client: client, done: done});
				}
			});
		});
	},
	/*
	 *select 查询
	 * */
	select: function (opts, params) {

		rap.info("select api createSql：", opts);

		var sqlObj = new rap.SQL(opts);

		if (!sqlObj.selectSql) {
			throw Error("cant find select sql");
		}
		return this.query(sqlObj.selectSql, params).then(function (queryResult) {

			rap.info("查询到数据：", queryResult);

			return queryResult.rows;

		});

	},
	/*
	 *查询
	 * */
	query: function (sql, params, callback) {
		if (typeof params == 'function') {
			callback = params;
			params = [];
		}
		if (!params) {
			params = [];
		}

		//是否打印SQL语句
		if (rap.sqldebug) {
			rap.log('[SQL:]', sql, '[:SQL]');
			rap.log('[PARAMS:]', params, '[:PARAMS]');
		}

		return this._connect()
			.then(function (connectResult) {
				var client = connectResult.client;
				var done = connectResult.done;
				return new Promise(function (resolve, reject) {
					client.query(sql, params, function (err, queryResult) {
						done();
						if (err) {
							reject(err);
						} else {
							if (typeof queryResult != "object") {
								resolve({rows: []});
							} else {
								resolve(queryResult);
							}
						}
					})
				});
			})
			.then(callback);
	}
};
