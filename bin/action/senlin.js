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