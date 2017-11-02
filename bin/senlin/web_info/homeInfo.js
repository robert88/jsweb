;(function () {
	var $body = 	$(".J-body");
	var $userPic = $body.find(".user-pic");
	var $userName = $body.find(".userName");
	var $userID = $body.find(".userID");
	var $userInvite = $body.find(".userInvite");
	var $userGold = $body.find(".userGold");
	var $userCoin = $body.find(".userCoin");
	
	
	var token = $.cookie("login_token");

	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	function toFloat(val){
		val = $.trim(val).replace(/,/g,"");
		val = parseInt(val,10);
		return val||0
	}
	/*
	 *加载数据
	 * */
	$(".loading").show();
	PAGE.ajax({
		type: 'get',
		msg: {
			"0": "登录token验证失败！",
			"1": "获取成功"
		},
		url: "/api/homeland?token="+token,
		success: function (ret) {
			if(ret){
				//头像
				var forest_sex = ret.sex;
				if (forest_sex == 0) {
					$userPic.removeClass("bg-user-female").addClass("bg-user-male")
				} else {
					$userPic.removeClass("bg-user-male").addClass("bg-user-female")
				}
				$.cookie("forest_sex",forest_sex);

				//财富
				var forest_gold = toFloat(ret.gold);
				var forest_coin = toFloat(ret.coin);

				$userGold.html(ret.gold);
				$userCoin.html(ret.coin);
				$.cookie("forest_gold",forest_gold);
				$.cookie("forest_coin",forest_coin);

				//邀请码
				$userInvite.html(ret.referrer);
				$userName.html($.cookie("login_nickname"));
				$userID.html(ret.user_id);
				
				//认证信息
				if(ret.auth){
					
				}
			}

		},complete:function () {
			$(".loading").hide();
		}
	});



})();