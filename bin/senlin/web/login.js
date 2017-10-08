require("./public/js/common.js");
;(function () {
	$("body").find(".J-submitBtn").removeClass("J-submitFocus");
	var $form = $("#loginForm");
	var cookiePassword = $.cookie("login_password");
	var cookieName = $.cookie("login_username");
	var $mobile = $form.find("input[name='mobile']");
	var $password = $form.find("input[name='password']");
	var $remenber = $form.find("input[name='remember']");
	var $rememberAccountCheckbox =  $form.find(".rememberAccount");
	var $rememberPassWordCheckbox =  $form.find(".r98ememberPassWord");
	var cookiePasswordTemp = "test12345678";
	if(cookiePassword && cookieName){
		$mobile.val(cookieName);
		//设置test1234567可以跳过校验和加密
		$password.val(cookiePasswordTemp);
		$rememberAccountCheckbox.click();
		$rememberPassWordCheckbox.click();
	}else if(cookieName){
		$mobile.val(cookieName);
		$rememberAccountCheckbox.click();
	}
	$form.find(".J-submitBtn").addClass("J-submitFocus");
	var validForm = PAGE.validForm({
		validSuccess:function ($form) {
			//记住密码
			if(cookiePassword && $password.val() == cookiePasswordTemp){
				$remenber.val(1);
				$password.val(cookiePassword);
			}
			PAGE.ajax({
				data:$form.serialize(),
				type:'get',
				msg:{
					"1":"登录成功",
					"2":"请填写手机号",
					"3":"请填写密码",
					"4":"用户不存在",
					"5":"帐号被冻结，请联系客服解封",
					"6":"密码错误，忘记密码请点击下方找回密码，密码输入错误5次后帐号冻结",
					"7":"密码错误"
				},
				url:"/api/user/login",
				success:function (ret) {
					$.tips("登录成功","success");
					window.location.hash="#web/home"
				},complete:function () {
					if(cookiePassword){
						$password.val(cookiePasswordTemp);
					}
				}
			})
		},
		validError:function($target,msg){
			$.tips(msg,"error");
			$target.focus();
		},
		form:$form
	});

	/*自定义校验方法*/
	var validRule = validForm("getRule");
	validRule["password"] = {
		check:function(value, $obj) {

			//传递了比较值
			var validLenth = /^(\d|[a-z]){6,12}$/i.test(value);
			var validNum = /[0-9]/.test(value);
			var validLetter = /[a-zA-Z]/.test(value);
			return ! (validNum&&validLetter && validLenth) ;
		},
		defaultMsg:"请填写6-12位同时包含字符和数字的密码"

	}
})();
