/**
 * Created by 84135 on 2017/9/30.
 */
var http = require("http");
var loginCount = 0;
var captchacount =0
var registerCount = 0;
exports = module.exports = {
	"/api/captcha":function (request, response,next) {
		captchacount++
		var ret
		if(captchacount>1){captchacount=0

			ret = "/public/images/yanzhema1.png"
		}else{
			ret = "/public/images/yanzhema2.png"
		}
		next(ret)
	},
	"/api/game/skill":function (request,response,next) {
		var str = "/api/game/skill";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		var data = [
			{
				"id": 1,
				"title": "三级化肥",
				"icon": "/public/images/propsItem/010daoju1.png",
				"introduce": "施三级化肥，成熟时，最高可收50元宝，25枚金币，每个阶段仅限施肥一次。",
				"type": 0
			},
			{
				"id": 2,
				"title": "二级化肥",
				"icon": "/public/images/propsItem/011daoju2.png",
				"introduce": "施二级化肥，成熟时，最高可收100元宝，50枚金币，每个阶段仅限施肥一次。",
				"type": 0
			},
			{
				"id": 3,
				"title": "一级化肥",
				"icon": "/public/images/propsItem/012daoju3.png",
				"introduce": "施一级化肥，成熟时，最高可收300元宝，150枚金币，每个阶段仅限施肥一次。",
				"type": 0
			},
			{
				"id": 4,
				"title": "特级化肥",
				"icon": "/public/images/propsItem/013daoju4.png",
				"introduce": "施特级化肥，成熟时，最高可收500元宝，250枚金币，每个阶段仅限施肥一次。",
				"type": 0
			},
			{
				"id": 5,
				"title": "生命液",
				"icon": "/public/images/propsItem/014daoju5.png",
				"introduce": "摇钱树被收取三次后，须为它浇一壶生命液，才能继续生产收益哟！否则，将无法称作。",
				"type": 1
			},
			{
				"id": 6,
				"title": "屠龙刀",
				"icon": "/public/images/propsItem/015daoju6.png",
				"introduce": "被龙形封印所罩住的摇钱树须使用屠龙刀将其封印破除，才能让其产生收益。",
				"type": 1
			},
			{
				"id": 7,
				"title": "叫花鸡",
				"icon": "/public/images/propsItem/016daoju7.png",
				"introduce": "每只鸡可保持灵兽5小时的体力及增加1个点的成长值。",
				"type": 2
			}
		]
		next( {code:count,data:data});
	},
	"/api/user/guide":function (request,response,next) {
		var str = "/api/user/guide";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>4){
			count = exports[str].count =1;
		}
		next( {code:count});
	},
	"/api/trees/life":function (request,response,next) {
		var str = "/api/trees/life";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>4){
			count = exports[str].count =1;
		}
		next( {code:count});
	},
	"/api/trees/life":function (request,response,next) {
		var str = "/api/trees/life";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		next( {code:count,data:{
			"coin": 35,
			"gold": 100
		}});
	},

	"/api/pay":function (request,response,next) {
		var str = "/api/trees/life";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>4){
			count = exports[str].count =1;
		}
		next( {code:count});
	},
	"/api/game":function (request,response,next) {
		var str = "/api/game";
		exports[str].count = (exports[str].count==null?-1:exports[str].count);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		var data = [
			[
				{
					"id": 1,
					"title": "三级化肥",
					"icon": "/public/images/propsItem/010daoju1.png",
					"price": 50,
					"unit": "元宝",
					"introduce": "施三级化肥，成熟时，最高可收50元宝，25枚金币，每个阶段仅限施肥一次。",
					"type": 0,
					"buy": 1
				},
				{
					"id": 2,
					"title": "二级化肥",
					"icon": "/public/images/propsItem/011daoju2.png",
					"price": 100,
					"unit": "元宝",
					"introduce": "施二级化肥，成熟时，最高可收100元宝，50枚金币，每个阶段仅限施肥一次。",
					"type": 0,
					"buy": 1
				},
				{
					"id": 3,
					"title": "一级化肥",
					"icon": "/public/images/propsItem/012daoju3.png",
					"price": 300,
					"unit": "元宝",
					"introduce": "施一级化肥，成熟时，最高可收300元宝，150枚金币，每个阶段仅限施肥一次。",
					"type": 0,
					"buy": 1
				},
				{
					"id": 4,
					"title": "特级化肥",
					"icon": "/public/images/propsItem/013daoju4.png",
					"price": 500,
					"unit": "元宝",
					"introduce": "施特级化肥，成熟时，最高可收500元宝，250枚金币，每个阶段仅限施肥一次。",
					"type": 0,
					"buy": 1
				}
			],
			[
				{
					"id": 5,
					"title": "生命液",
					"icon": "/public/images/propsItem/014daoju5.png",
					"price": 50,
					"unit": "元宝",
					"introduce": "摇钱树被收取三次后，须为它浇一壶生命液，才能继续生产收益哟！否则，将无法称作。",
					"type": 1,
					"buy": 1
				},
				{
					"id": 6,
					"title": "屠龙刀",
					"icon": "/public/images/propsItem/015daoju6.png",
					"price": 50,
					"unit": "元宝",
					"introduce": "被龙形封印所罩住的摇钱树须使用屠龙刀将其封印破除，才能让其产生收益。",
					"type": 1,
					"buy": 1
				}
			],
			[
				{
					"id": 7,
					"title": "叫花鸡",
					"icon": "/public/images/propsItem/016daoju7.png",
					"price": 50,
					"unit": "元宝",
					"introduce": "每只鸡可保持灵兽5小时的体力及增加1个点的成长值。",
					"type": 2,
					"buy": 1
				}
			]
		]
		next( {code:count,data:data});
	},
	"/api/homeland":function (request,response,next) {
		var str = "/api/homeland";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		data = {
				"user_id": 2, // 用户ID
				"mobile": "15201103719", // 用户昵称，默认手机号
				"sex": 1, // 性别，用于显示头像
				"referrer": "18234030578", // 推荐人
				"gold": "500.00", // 元宝数量
				"coin": "500.00", // 金币金额
			}

		next( {code:count,data:data});
	},
	"/api/user/forget":function (request,response,next) {
		var str = "/api/user/forget";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		data = {
			"token": "S0M1OWgwaFNmc3dHRWN3ejVmYWFiQT09"
		}
		next( {code:count,data:data});
	},
	"/api/user/reset":function (request,response,next) {
		var str = "/api/user/reset";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>4){
			count = exports[str].count =1;
		}
		next( {code:count});
	},

	"/api/trees/collect":function (request,response,next) {
		var str = "/api/trees/collect";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		next( {code:count,data:{path:"/load/1.png"}});
	},
	"/api/homeland/bank":function (request,response,next) {
		var str = "/api/homeland/bank";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		next( {code:count,data:{path:"/load/1.png"}});
	},
	"/api/homeland/upload":function (request,response,next) {
		var str = "/api/homeland/upload";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		next( {code:count,data:{path:"/load/1.png"}});
	},

	"/api/game/pocket":function (request,response,next) {
		var str = "/api/game/pocket";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		var data = [
			[
				{
					"id": 1,
					"title": "三级化肥",
					"icon": "/public/images/propsItem/010daoju1.png",
					"introduce": "施三级化肥，成熟时，最高可收50元宝，25枚金币，每个阶段仅限施肥一次。",
					"number":1,
					"type": 0
				},
				{
					"id": 2,
					"title": "二级化肥",
					"icon": "/public/images/propsItem/011daoju2.png",
					"introduce": "施二级化肥，成熟时，最高可收100元宝，50枚金币，每个阶段仅限施肥一次。",
					"number":1,
					"type": 0
				},
				{
					"id": 3,
					"title": "一级化肥",
					"icon": "/public/images/propsItem/012daoju3.png",
					"introduce": "施一级化肥，成熟时，最高可收300元宝，150枚金币，每个阶段仅限施肥一次。",
					"number":1,
					"type": 0
				},
				{
					"id": 4,
					"title": "特级化肥",
					"icon": "/public/images/propsItem/013daoju4.png",
					"introduce": "施特级化肥，成熟时，最高可收500元宝，250枚金币，每个阶段仅限施肥一次。",
					"number":1,
					"type": 0
				},
				{
					"id": 5,
					"title": "生命液",
					"icon": "/public/images/propsItem/014daoju5.png",
					"introduce": "摇钱树被收取三次后，须为它浇一壶生命液，才能继续生产收益哟！否则，将无法称作。",
					"number":10,
					"type": 1
				},
				{
					"id": 6,
					"title": "屠龙刀",
					"icon": "/public/images/propsItem/015daoju6.png",
					"introduce": "被龙形封印所罩住的摇钱树须使用屠龙刀将其封印破除，才能让其产生收益。",
					"number":12,
					"type": 1
				}
			],
			[
				{
					"id": 7,
					"title": "叫花鸡",
					"icon": "/public/images/propsItem/016daoju7.png",
					"introduce": "每只鸡可保持灵兽5小时的体力及增加1个点的成长值。",
					"number":12,
					"type": 2
				}
			]
		]
		next( {code:count,data:data});
	},
	"/api/trees/apply":function (request,response,next) {
		var str = "/api/trees/apply";
		exports[str].count = (exports[str].count==null?-1:exports[str].count);
		var count = ++exports[str].count;
		if(count>5){
			count = exports[str].count =1;
		}
		next( {code:count,data:{
			"serial": "2",
				"status": "1",
				"apply_type": "1",// 特殊化肥1
				"apply_at": "2017-10-15 18:13:45",
				"countdown": 7*24*60*60
		}});
	},
"/api/reward":function (request,response,next) {
	var str = "/api/reward";
	exports[str].count =  (exports[str].count==null?-1:exports[str].count);
	var count = ++exports[str].count;
	if(count>5){
		count = exports[str].count =1;
	}
	next( {code:count});
},
"/api/trees/relieve":function(request,response,next){
	var str = "/api/trees/relieve";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}
	next( {code:count});
},
	"/api/trees":function(request,response,next){
		var str = "/api/trees";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		count = exports[str].count =1;
		var data =  [
				{
					"serial": "1", // 摇钱树编号1-10
					"status": "0", // 摇钱树当前状态，0未破除封印，1已破除，2已收获，3 需浇生命液进行激活
					"apply_type": "0", // 0未破除封印
					"apply_at": "2017-10-15 18:13:45", // 施肥时间
					"countdown": "604800" // 可收取开始时间
				},
				{
					"serial": "2",
					"status": "1",
					"apply_type": "1",// 特殊化肥1
					"apply_at": "2017-10-15 18:13:45",
					"countdown": "10"
				},
				{
					"serial": "3",
					"status": "1",
					"apply_type": "2",// 一级化肥
					"apply_at": "2017-10-15 18:13:45",
					"countdown": "10"
				},
				{
					"serial": "4",
					"status": "1",
					"apply_type": "3",// 二级化肥
					"apply_at": "2017-10-15 18:13:45",
					"countdown": "10"
				},
				{
					"serial": "5",
					"status": "1",
					"apply_type": "4",// 三级化肥
					"apply_at": "2017-10-15 18:13:45",
					"countdown": "10"
				},
				{
					"serial": "6",
					"status": "2",
					"apply_type": "0",
					"apply_at": "2017-10-15 18:13:45",
					"countdown": "2017-10-15 18:14:45"
				},
				{
					"serial": "7",
					"status": "3",
					"apply_type": "0",
					"apply_at": "2017-10-15 18:13:45",
					"countdown": "2017-10-15 18:14:45"
				},
				{
					"serial": "8",
					"status": "1",
					"apply_type": "1",
					"apply_at": "2017-10-15 18:13:45",
					"countdown": "-10"
				},
				{
					"serial": "9",
					"status": "1",
					"apply_type": "2",
					"apply_at": "2017-10-15 18:13:45",
					"countdown": "-10"
				},
				{
					"serial": "10",
					"status": "1",
					"apply_type": "3",
					"apply_at": "2017-10-15 18:13:45",
					"countdown": "-10"
				}
			]
		
		next( {code:count,data:data});
	},

"/api/user/logout":function (request,response,next) {
	var str = "/api/user/logout";
	exports[str].count = (exports[str].count||0);
	var count = ++exports[str].count;
	if(count>2){
		count = exports[str].count =1;
	}
	next( {code:count})
},
	"/api/pay/gold":function (request,response,next) {
		var str = "/api/pay/gold";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>2){
			count = exports[str].count =1;
		}
		next( {code:count,data:{"url": "www.baidu.com"}});
	},
	"/api/user/login":function(request,response,next){
		var ret = {code:1,msg:"success"};
		if(loginCount>6){
			loginCount=0
		}

		switch (++loginCount){
			case 1:
				ret = {code:1};
				request.cookie.push("login_token=RUVIQ2JFZ3ZIM2RwcURUbkhsOWE4QWdsWmdEV2ZZZlhSZWNxY2ZsTmlScz0;path=/");
				request.cookie.push("login_uid=123;path=/");
				request.cookie.push("forest_sex=0;path=/");
				request.cookie.push("forest_gold=100;path=/");
				request.cookie.push("forest_coin=500;path=/");
				request.cookie.push("invite_code=5648;path=/");
				if(request.params.remember_account){
					request.cookie.push("login_username=18688714537;path=/");
				}else{
					request.cookie.push("login_username='';path=/");
				}
				if(request.params.remember_password){
					request.cookie.push("login_password=RUVIQ2JFZ3ZIM2RwcURUbkhs;path=/");
				}else{
					request.cookie.push("login_password='';path=/");
				}
				// response.setHeader("Set-Cookie","name=login_uid;;","12345678")
				break;
			case 2:
				ret = {code:2};
				break;
			case 3:
				ret = {code:3};
				break;
			case 4:
				ret = {code:4};
				break;
			case 5:
				ret = {code:5};
				break;
			case 6:
				ret = {code:6};
				break;
			case 7:
				ret = {code:7};
				break;
		}
		next(ret)
	},
	"/api/user/sms":function(request,response,next){
		var str = "/api/user/sms";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>5){
			count = exports[str].count =1;
		}
		next( {code:count});
	},
	"/api/user/register":function(request,response,next){
		var ret = {code:1,msg:"success"};
		if(registerCount>=10){
			registerCount=0
		}

		switch (++registerCount){
			case 1:
				ret = {code:1};
				request.cookie.push("login_token=RUVIQ2JFZ3ZIM2RwcURUbkhsOWE4QWdsWmdEV2ZZZlhSZWNxY2ZsTmlScz0;path=/");
				request.cookie.push("login_uid=123;path=/");
				if(request.params.remember_account){
					request.cookie.push("login_username=18688714537;path=/");
				}else{
					request.cookie.push("login_username='';path=/");
				}
				if(request.params.remember_password){
					request.cookie.push("login_password=RUVIQ2JFZ3ZIM2RwcURUbkhs;path=/");
				}else{
					request.cookie.push("login_password='';path=/");
				}
				// response.setHeader("Set-Cookie","name=login_uid;;","12345678")
				break;
			default:
				ret = {code:registerCount};
				break;
		}
		next(ret)
	}
};