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
	"/api/user/guide":function (request,response,next) {
		var str = "/api/user/guide";
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
		if(count>5){
			count = exports[str].count =1;
		}
		var data = [
			[
				{
					"id": 1,
					"title": "三级化肥",
					"icon": "/uploads/config/2017/10/0799331bac1f0ea0df28ac7f6d1aed67.png",
					"price": 50,
					"unit": "元宝",
					"introduce": "施三级化肥，成熟时，最高可收50元宝，25枚金币，每个阶段仅限施肥一次。",
					"type": 0,
					"buy": 1
				},
				{
					"id": 2,
					"title": "二级化肥",
					"icon": "/uploads/config/2017/10/f3edee32eea6825103330ec66419c22b.png",
					"price": 100,
					"unit": "元宝",
					"introduce": "施二级化肥，成熟时，最高可收100元宝，50枚金币，每个阶段仅限施肥一次。",
					"type": 0,
					"buy": 1
				},
				{
					"id": 3,
					"title": "一级化肥",
					"icon": "/uploads/config/2017/10/0f08f7c19cf0cbdf6e8e583971b2bd38.png",
					"price": 300,
					"unit": "元宝",
					"introduce": "施一级化肥，成熟时，最高可收300元宝，150枚金币，每个阶段仅限施肥一次。",
					"type": 0,
					"buy": 1
				},
				{
					"id": 4,
					"title": "特级化肥",
					"icon": "/uploads/config/2017/10/e59f2c2ac32baa0c938f7b69a168050a.png",
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
					"icon": "/uploads/config/2017/10/e9ea6adc9421b5be006dcf2f7618d46c.png",
					"price": 50,
					"unit": "元宝",
					"introduce": "摇钱树被收取三次后，须为它浇一壶生命液，才能继续生产收益哟！否则，将无法称作。",
					"type": 1,
					"buy": 1
				},
				{
					"id": 6,
					"title": "屠龙刀",
					"icon": "/uploads/config/2017/10/a92e5211be679e61811b316803120828.png",
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
					"icon": "/uploads/config/2017/10/a5233f101d359cb53c8d5561cca1ed60.png",
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
	" /api/game/pocket":function (request,response,next) {
		var str = "/api/game/pocket";
		exports[str].count = (exports[str].count==null?-1:exports[str].count);
		var count = ++exports[str].count;
		if(count>5){
			count = exports[str].count =1;
		}
		var data = [
			[
				{
					"id": 1,
					"title": "三级化肥",
					"icon": "/uploads/config/2017/10/0799331bac1f0ea0df28ac7f6d1aed67.png",
					"introduce": "施三级化肥，成熟时，最高可收50元宝，25枚金币，每个阶段仅限施肥一次。",
					"type": 0
				},
				{
					"id": 2,
					"title": "二级化肥",
					"icon": "/uploads/config/2017/10/f3edee32eea6825103330ec66419c22b.png",
					"introduce": "施二级化肥，成熟时，最高可收100元宝，50枚金币，每个阶段仅限施肥一次。",
					"type": 0
				},
				{
					"id": 3,
					"title": "一级化肥",
					"icon": "/uploads/config/2017/10/0f08f7c19cf0cbdf6e8e583971b2bd38.png",
					"introduce": "施一级化肥，成熟时，最高可收300元宝，150枚金币，每个阶段仅限施肥一次。",
					"type": 0
				},
				{
					"id": 4,
					"title": "特级化肥",
					"icon": "/uploads/config/2017/10/e59f2c2ac32baa0c938f7b69a168050a.png",
					"introduce": "施特级化肥，成熟时，最高可收500元宝，250枚金币，每个阶段仅限施肥一次。",
					"type": 0
				},
				{
					"id": 5,
					"title": "生命液",
					"icon": "/uploads/config/2017/10/e9ea6adc9421b5be006dcf2f7618d46c.png",
					"introduce": "摇钱树被收取三次后，须为它浇一壶生命液，才能继续生产收益哟！否则，将无法称作。",
					"type": 1
				},
				{
					"id": 6,
					"title": "屠龙刀",
					"icon": "/uploads/config/2017/10/a92e5211be679e61811b316803120828.png",
					"introduce": "被龙形封印所罩住的摇钱树须使用屠龙刀将其封印破除，才能让其产生收益。",
					"type": 1
				}
			],
			[
				{
					"id": 7,
					"title": "叫花鸡",
					"icon": "/uploads/config/2017/10/a5233f101d359cb53c8d5561cca1ed60.png",
					"introduce": "每只鸡可保持灵兽5小时的体力及增加1个点的成长值。",
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
		next( {code:count,data:{muckTime:new Date().getTime()}});
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
		if(count>2){
			count = exports[str].count =1;
		}
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
	"/api/charge":function (request,response,next) {
		var str = "/api/charge";
		exports[str].count = (exports[str].count||0);
		var count = ++exports[str].count;
		if(count>2){
			count = exports[str].count =1;
		}
		next( {code:count});
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