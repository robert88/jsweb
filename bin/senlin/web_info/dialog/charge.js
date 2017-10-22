;(function () {
	var $dialog = 	$(".chargeContent").parents(".dl-dialog");
	var forest_gold = $.cookie("forest_gold");
	var $header = $("header");
	var $yuanbao = $header.find(".yuanbao-text");
	$dialog.on("click",".J-okBtn",function (e) {
		var value = $dialog.find("input").val();
		if (value < 100) {
			$.tips("100元起冲");
			return false;
		} else {
			PAGE.ajax({
				type: "get",
				msg: {
					"1": "充值成功",
					"2": "充值发生错误"
				},
				url: "/api/charge?value=" + value,
				success: function () {
					$.tips("充值成功", "success");
					$.dialog.close($dialog,e);

					forest_gold = forest_gold*1 + value*1;
					$.cookie("forest_gold",forest_gold);
					$yuanbao.html(forest_gold);

					if(PAGE.guide.needGuide && PAGE.guide.step=="charge"){
						PAGE.guide.next();
					}
				}, complete: function () {
					$dialog.trigger("chargeComplete");
				}
			})
		}
	})

})();