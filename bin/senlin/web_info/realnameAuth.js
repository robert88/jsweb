$(function () {
	var token = $.cookie("login_token");

	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	require("../public/js/selectFile.js");

	var $module = $(".realnameAuthBody");
	/*上传文件*/
	$module.find(".J-input-file").each(function () {
		var $this = $(this)
		$this.selectFile(function (src, file) {
			selectFile($this, src, file)
		})
	});
	function selectFile($this, src, file) {
		var $filePathIpt = $this.parent().parent().find(".J-upload-file-path");
		var imgData = src;
		if (file.type !== "image/png" && file.type !== "image/jpeg") {
			$.tips("请上传png或者jpg格式的图片文件！");
			$this.val("").trigger("change");
			return;
		}
		if (file.size / 1024 / 1024 > 5) {
			$.tips("图片超过5M！");
			$this.val("").trigger("change");
			return;
		}

		if (!imgData) {
			$.tips("无效图片格式！");
			return;
		}
		// "image/png"&&file.type!=="image/jpeg"
		PAGE.ajax({
			url: "/api/homeland/upload",
			type: "post",
			data: imgData,
			success: function (data) {

				if (data.path) {
					//提供一个外部触发的工具
					var img = new Image();

					img.onload = function () {
						$this.parent().find("img").remove();
						$this.parent().append(img);
						$filePathIpt.val(data.path).trigger("change");
					}
					img.src = imgData;
				}
			}
		});
	}

	var $form = $module.find("form");
	PAGE.validForm({
		validSuccess: function ($form) {
			PAGE.ajax({
				data: $form.serialize() + "&token=" + token,
				type: 'post',
				msg: {
					"1": " 验证通过",
					"2": "请填写密码",
					"3": "两次密码不一致",
					"4": "校验码为空",
					"5": "校验失败",
					"6": "用户不存在"
				},
				url: "/api/homeland/realname",
				success: function (ret) {
					$.tips("<div class='pt10 pb10 pr20 lh30' style='line-height: 2rem'><h3 class='tc'>密码修改成功</h3>" +
						"<p class='fs14'>3秒后返回登陆页面</p></div>", {
						type: "success", time: 3000, closeAfter: function () {
							PAGE.setUrl('#/web_info/login.html');
						}
					})
				}
			})
		},
		validError: function ($target, msg) {
			$.tips(msg, "error");
			$target.focus();
		},
		form: $form
	});

});