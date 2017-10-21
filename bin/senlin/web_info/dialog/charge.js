;(function () {
	var $dialog = 	$(".chargeContent").parents(".dl-dialog");

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
				}, complete: function () {
					$dialog.trigger("chargeComplete");
				}
			})
		}
	})

})();