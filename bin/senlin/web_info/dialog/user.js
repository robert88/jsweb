;(function () {
	var $dialog = 	$(".userContent").parents(".dl-dialog");
	var $userPic = $dialog.find(".user-pic");
	var $userName = $dialog.find(".userName");
	var $userID = $dialog.find(".userID");
	var $userInvite = $dialog.find(".userInvite");
	var $userGold = $dialog.find(".userGold");
	var $userCoin = $dialog.find(".userCoin");

	var $header = $("header");

	var $headerUserPic = $header.find(".user-pic");
	var $headerUserCoin = $header.find(".coin-text");
	var $headerUserGold = $header.find(".gold-text");
	var token = $.cookie("login_token");
	if (!token) {
		window.location.hash="#/web_info/login.html";
		return;
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
					$headerUserPic.removeClass("bg-user-female").addClass("bg-user-male");
				} else {
					$userPic.removeClass("bg-user-male").addClass("bg-user-female")
					$headerUserPic.removeClass("bg-user-male").addClass("bg-user-female");
				}
				$.cookie("forest_sex",forest_sex);

				//财富
				var forest_gold = ret.gold||0;
				var forest_coin = ret.coin||0;
				$headerUserGold.html(forest_gold);
				$userGold.html(forest_gold);
				$headerUserCoin.html(forest_coin);
				$userCoin.html(forest_coin);
				$.cookie("forest_gold",forest_gold);
				$.cookie("forest_coin",forest_coin);

				//邀请码
				$userInvite.html(ret.referrer);
				$userName.html(ret.mobile);
				$userID.html(ret.user_id);
			}

		},complete:function () {
			$(".loading").hide();
		}
	});
	
	

})();