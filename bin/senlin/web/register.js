require("./public/js/common.js");
;(function () {
	var $form = $("#registerForm");
	var $captcha = $form.find(".J-captcha");
	$captcha.click(changeImage);
	function changeImage(){
		$captcha[0].src = "/api/captcha?type=register&ver="+ (new Date().getTime());
	}
	changeImage();


	$form.find(".J-submitBtn").addClass("J-submitFocus");
	var validForm = PAGE.validForm({
		validSuccess:function ($form) {

			PAGE.ajax({
				data:$form.serialize(),
				type:'get',
				msg:{
				"1":" 注册成功",
				"2": "请填写手机号",
				"3" :"请填写昵称",
				"4": "请填写密码",
				"5": "两次密码不一致",
				"6": "验证码不正确",
				"7" :"推荐码错误",
				"8": "短信验证码校验失败",
				"9": "数据校验失败",
				"10": "注册失败"
				},
				url:"/api/user/register",
				success:function (ret) {
					$.tips("注册成功","success");
					window.location.hash="#web/home"
				}
			})
		},
		validError:function($target,msg){
			$.tips(msg,"error");
			$target.focus();
		},
		form:$form
	});

	$form.find(".J-getMobileCode").click(function () {
		var $this =$(this);
		if($this.data("lock") || $this.data("lock-text")){
			return ;
		}
		$this.data("lock",true).data("lock-text",true);
		var $text =$this.find(".text-gradient");

		var originText = $text.data("text");
		$text.data("text",60).html(60);
		PAGE.ajax({type:"post",
			msg:{
				"1" :"发送成功",
				"2": "手机号格式不正确",
				"3" :"用户不存在（即手机号未注册，用于找回密码）",
				"4": "用户已注册",
				"5": "发送失败"
			},
			url:"/api/user/sms?type=register",
			success:function () {
			timoutCount($text,60,function(){
				$.tips("发送成功","success")
				$text.data("text",originText).html(originText);
				$this.data("lock-text",false);
			});
		},complete:function () {
			$this.data("lock",false);
		},errorCallBack:function () {
				$this.data("lock-text",false);
				$text.data("text",originText).html(originText);
		}});
	})
	function timoutCount($text,time,callback) {
		time--;
		$text.data("text",time).html(time);
		if(time<=0){
			if(typeof callback=="function"){
				callback()
			}
		}else{
			setTimeout(timoutCount,1000,$text,time,callback)
		}
	}
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