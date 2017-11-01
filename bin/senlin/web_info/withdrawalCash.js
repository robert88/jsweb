;(function () {
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	$(".J-withdrawal-btn").click(function () {
		var $dialog = $.dialog($("#withdrawlDialog"),{width:300,closeStyle:"background: rgba(255,255,255,0.9);"});
		var $form = $dialog.find("form");
		var validForm = PAGE.validForm({
			validSuccess:function ($form) {
				PAGE.ajax({
					data:$form.serialize()+"&token="+token,
					type:'get',
					msg:{
						"0": "登录token验证失败",
						"1":" 申请成功",
						"2": "请先进行实名认证，并绑定银行卡",
						"3" :"请绑定银行卡信息",
						"4": "最低限额为100",
						"5": "申请超过余额"
					},
					url:"/api/homeland/withdraw?token="+token+"&type=1",
					success:function (ret) {
						$.tips("<div class='tc'>提现成功<br>预计1-3个工作日到账</div>","success");
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
		validRule["number100"] = {
			check:function(validNum, $obj) {
				return ! (validNum%100 ==0) ;
			},
			defaultMsg:"最低提现额100以上，且为整数"

		}
	})

})();