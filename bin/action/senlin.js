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
	"/api/pay/gold":function (request,response,next) {
		var str = "/api/pay/gold";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>2){
			count = exports[str].count =1;
		}
		next( {code:count,data:{
			"qrcode": "data:image/png;base64,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LmNs2bJl5k0StruFL2FXgYsZHBxycMrg4JCDixmSwK5du1pbW8PT6d+/f79+/cLTcZDCKUMAtLe379ixo6SkZPjw4YEaTp8+/bXXXgsvwGOPPTZ79mxNBWsJHZhzkwzR0NAwefLkPn36XHvttYyxnlo4CbsoMpzztGUoOLz//vurV69es2bN22+/vWHDhmw265WfffbZV1555S9/+Ut989NPP725ufnYsWPxHXYofAm7JNJOZxUirr76am9wioqKvOT9D3/4w+bmZsPmCSQuC1/CrgjnJklw6623zpw5869//ev+/fvr6uoYY5deeml1dXXacv0/Cl/CrggXQEtw3XXXXXfddWlLoUPhS9gV4XYGB4ccnDI4OOTglMHBIQcXMwTGyJEjOzo6NBVaWloSE0aKwpewMOGUwQfeqioq+v8tdMeOHceOHUtPIozCl7CrwCmDHDfddJP35OS2bdsYY8OGDRM/tbW16dt6t7RiFY91BQm7HFzMIMeIESO2bNmyY8eOc889d/78+bW1tWlLhFH4EnY5uOMY0ePDDz88ceLEOeeck7YgShS+hKnAKYODQw7OTXJwyMEpg4NDDk4ZHBxycMrg4JCDUwYHhxycMjg45OCUwcEhB6cMDg45OGVwcMjBKYODQw5OGRwccnDK4OCQg1MGB4ccnDI4OOTglMHBIQenDA4OOfwf0CTzW7Ux3sAAAAAASUVORK5CYII="
		}});
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