;(function () {
	PAGE.data = PAGE.data||{};
	PAGE.data.audio = PAGE.data.audio || "open";
	var $body = $(".J-body");
	var dx, dy, dflag, ex, ey, dw, dh;
	/*缩小*/
	var audios = {};
	var currZoom = 1;//最小的状态显示
	var perDr;
	var scaleTimer = 0;
	var token = $.cookie("login_token");

	$(document).off("mousedown.dragbg touchstart.dragbg").on("mousedown.dragbg touchstart.dragbg", function (e) {
		if ($(e.target).parents(".dl-dialog").length) {
			return;
		}
		var $treeItem;
		if ($(e.target).hasClass("treeItem")) {
			$treeItem = $(e.target);
		} else {
			$treeItem = $(e.target).parents(".treeItem")
		}
		if ($treeItem.length && ($.cookie("forest_guide") || (!$.cookie("forest_guide") && $treeItem.data("guide")) )) {
			return;
		}
		if (e.type === "touchstart") {
			e = e.originalEvent.touches[0];
		}
		dflag = true;
		dx = $body.css("left").toFloat();
		dy = $body.css("top").toFloat();
		ex = e.pageX;
		ey = e.pageY;
		dw = $(window).width() - 1500 * currZoom / 100;
		dh = $(window).height() - 1500 * currZoom / 100;
		//手机端需要处理缩放不能屏蔽掉默认事件
		if (e.type !== "touchstart") {
			return false;
		}
	}).off("mousemove.dragbg touchmove.dragbg").on("mousemove.dragbg touchmove.dragbg", function (e) {
		if (dflag) {
			if (e.type === "touchmove") {
				var touches = e.originalEvent.touches;
				e = e.originalEvent.touches[0];
				if (touches.length > 1) {
					//每隔5次触发一次缩放
					if (scaleTimer == 0) {
						scaleZoom(e, touches[1]);
					}
					scaleTimer++;
					if (scaleTimer > 4) {
						scaleTimer = 0
					}
					return;
				}
			}
			var tx = e.pageX - ex + dx;
			var ty = e.pageY - ey + dy;

			tx = tx < dw ? dw : tx;
			ty = ty < dh ? dh : ty;
			tx = tx > 0 ? 0 : tx;
			ty = ty > 0 ? 0 : ty;
			$body.css("left", tx + "px");
			$body.css("top", ty + "px");
		}
	}).off("mouseup.dragbg touchup.dragbg").on("mouseup.dragbg touchup.dragbg", function (e) {
		perDr = null;
		dflag = false;
		//电脑端滚轮缩放
	}).off("mousewheel.dragbg").on("mousewheel.dragbg", function (evt) {
		if ($(evt.target).parents(".dl-dialog").length) {
			return;
		}
		var wheelDelta = evt.wheelDelta || evt.detail;

		//jquery bug； zepto没这个问题
		if (!wheelDelta && evt.originalEvent) {
			evt = evt.originalEvent;
			wheelDelta = evt.wheelDelta || evt.detail;
		}
		//没有滚动条
		if (wheelDelta < 0 || wheelDelta == 3) {
			reduceImage();

		} else if (wheelDelta > 0 || wheelDelta == -3) {
			zoomImage();
		}

		// return false;
	}).off("click.dragbg", ".J-dialog").on("click.dragbg", ".J-dialog", function (evt) {
		var $this = $(this);
		//用户指引,且没有指引过
		if (!$.cookie("forest_guide") && !$this.data("guide") ||  $this.data("lock")) {
			return;
		}
		$this.removeClass("popToPop");
		var url = $this.data("url");
		var dialogId = $this.data("id");
		var dialogClass = $this.data("class");
		if (url) {
			$(".loading").show();
			$.dialog("url:" + url, {
				width: 330,
				dialogClass: dialogClass,
				id: (dialogId ? dialogId : ""),
				maskClose: false,
				closeBefore: $this[0].closeBefore,
				close: false, button: [{text: "", className: "backBtn"}],
				ready: function ($dialog) {
					$(".loading").hide();
					if (typeof $this[0].dialogReady == "function") {
						$this[0].dialogReady($dialog);
					}
				}
			});
		}
	});

	$(window).off("resize.dragbg").on("resize.dragbg", function (evt) {
		zoomBody()
	});

	/*缩放到最适合屏幕的大小*/
	zoomBody();

	/*手机端缩放*/
	function scaleZoom(e1, e2) {
		var dex1 = e1.pageX;
		var dey1 = e1.pageY;
		var dex2 = e2.pageX;
		var dey2 = e2.pageY;
		var dr = Math.sqrt((dex1 - dex2) * (dex1 - dex2) + (dey1 - dey2) * (dey1 - dey2));
		//$.tips(dr)
		if (perDr) {
			if (dr - perDr > 0) {
				zoomImage();
			} else {
				reduceImage();
			}
			perDr = dr;
		}

		if (perDr == null) {
			perDr = dr;
		}

	}

	/*缩放是根据当前窗口的大小来缩放*/
	function zoomBody() {
		var offsetX = $body.css("left").toFloat(0);
		var offsetY = $body.css("top").toFloat(0);
		var zoomx = $(window).width() / (1500) * 100;
		var zoomy = $(window).height() / (1500) * 100;
		var minZoom = Math.max(zoomx, zoomy);
		var maxZoom = Math.max(minZoom, 100);
		if (currZoom < minZoom) {
			currZoom = minZoom;
		}
		if (currZoom > maxZoom) {
			currZoom = maxZoom;
		}
		if (currZoom > 100) {
			offsetX = 0;
			offsetY = 0;
		} else {
			offsetX = offsetX * currZoom / 100;
			offsetY = offsetY * currZoom / 100;
		}
		$body.css({
			"transform": "scale(" + currZoom / 100 + "," + currZoom / 100 + ")",
			left: offsetX,
			top: offsetY
		});
	}

	/*放大*/
	function zoomImage() {
		currZoom++;
		zoomBody()
	}

	/*缩小*/
	function reduceImage() {
		currZoom--;
		zoomBody()
	}


	//处理封印
	function handleFengyin($fengyin, $treeItem) {
		var treeId = $treeItem.attr("id");
		$.dialog("<div class='bg-title bg-title-confirm'></div><div style='text-align: center;margin-top: 58px;'>是否破除封印？</div>",
			{
				width: 330,
				dialogClass: "smallDialog",
				maskClose: false,
				close: false,
				closeBefore: $fengyin[0].closeBefore,
				footerStyle: "bottom: 15px;",
				button: [
					{
						text: '<span class="btn-tab"><span class="text-gradient" data-text="确认">确认</span></span>',
						click: function (e, $dialog) {
							PAGE.ajax({
								type: "get",
								msg: {
									"-1": "暂无破除封印道具",
									"0": "登录token验证失败",
									"1": "破除成功",
									"2": "摇钱树编号错误！",
									"3": "摇钱树不存在！",
									"4": "摇钱树已破除封印！"
								},
								url: "/api/trees/relieve?serial=" + parseInt(treeId.replace("tree", ""), 10) + "&token=" + token,
								success: function () {
									$.tips("成功破除", "success");
									$fengyin.remove();
								}, complete: function () {
									if (typeof $fengyin[0].confirm == "function") {
										$fengyin[0].confirm($dialog);
									}
									$.dialog.close($dialog);
								}
							})
							return false;
						}
					},
					{
						text: '<span class="btn-tab-active ml10"><span class="text-gradient" data-text="取消">取消</span></span>',
						className: "cancelBtn"
					}
				]
			});
	}

	function handletrunk($trunk, $treeItem) {
		var treeId = $treeItem.attr("id");
		$treeItem.removeClass("popPop");
		if ($treeItem.data("counter")) {
			var  playTimer = playTimerAudio( $treeItem.data("counter")*1);
			var $dilaog = $.tips("摇钱树距离下一个阶段的成长还有<span class='counter'>" + $treeItem.data("counter") + "</span>秒","warn",5000,function(){
				playTimer.lock = true;
				clearTimeout(playTimer.timer);
			});
			counter($dilaog.find(".counter"), $treeItem.data("counter"), function (ele, count) {
				$(ele).html(count)
			})
			return
		}
		$.dialog("<div class='bg-title bg-title-confirm'></div><div style='text-align: center;margin-top: 58px;'>是否为" + treeId.replace("tree", "") + "施肥？</div>",
			{
				width: 330,
				dialogClass: "smallDialog",
				maskClose: false,
				close: false,
				closeBefore: $trunk[0].closeBefore,
				footerStyle: "bottom: 15px;",
				button: [
					{
						text: '<span class="btn-tab"><span class="text-gradient" data-text="确认">确认</span></span>',
						click: function (e, $dialog) {
							PAGE.ajax({
								type: "post",
								msg: {
									"-1": "暂无该类型化肥",
									"0": "登录token验证失败",
									"1": "施肥成功",
									"2": "摇钱树编号错误",
									"3": "摇钱树不存在",
									"4": "摇钱树未破除封印",
									"5": "摇钱树已施肥！",
									"6": "摇钱树需浇生命液进行激活"
								},
								url: "/api/trees/apply?serial=" + parseInt(treeId.replace("tree", ""), 10) + "&token=" + token+"&property_id="+property_id,
								success: function (treeInfo) {
									$.tips("施肥成功", "success");
									counter($treeItem, treeInfo.countdown);
								}, complete: function () {
									if (typeof $trunk[0].confirm == "function") {
										$trunk[0].confirm($dialog);
									}
									$.dialog.close($dialog);
								}
							});
							return false
						},
					},
					{
						text: '<span class="btn-tab-active ml10"><span class="text-gradient" data-text="取消">取消</span></span>',
						className: "cancelBtn"
					}
				]
			});
	}

	/*点击树*/
	$body.on("click", ".treeItem", function () {
		var $this = $(this);
		if (!$.cookie("forest_guide") && !$this.data("guide") || $this.data("lock")) {
			return;
		}
		var $fengyin = $this.find(".fengyin");
		var $trunk = $this.find(".trunk");
		if ($fengyin.length) {
			handleFengyin($fengyin, $this);
		} else if ($trunk.length) {
			handletrunk($trunk, $this);
		} else {
			handleReward($this)
		}

	});
	function handleReward($tree) {
		if ($tree.find(".bg-daoju-hand")) {
			var treeInfo = $tree.data("treeinfo");
			PAGE.ajax({
				type: "get",
				msg: {
					"1": "恭喜丰收",
					"2": "当前的树还未成熟！"
				},
				url: "/api/reward?serial=" + treeInfo.serial ,
				success: function (ret) {
					$.tips("恭喜一轮的丰收！是否继续施肥！", "success");
					console.log(treeInfo.apply_type)
					$tree.data("lock",true)
					playRewardCoin(treeInfo.apply_type,10,function(){
						$tree.data("lock",false);
					});

					$tree.html('<div class="trunk bg-renwu"></div>');
				}
			});
		}
	}



	function playRewardAnimate($ani,count) {
		var arr = ["0", "-130px 0px", "-260px 0px", " -390px 0px", "-520px 0px", "0px -280px", "-130px -280px", "-260px -280px", "-390px -280px", "-520px -280px", "-1000px -1000px"]
		if(!$ani){
			$ani = $("<div class='bg-banquetfiy'></div>").appendTo("body");
		}
		if(typeof count=="undefined"){
			count = 0;
			$ani.css("left",(10*Math.random()+45) +"%")
		}
		count++;

		$ani.css("background-position", arr[count]);

		if(count>=arr.length-1){
			count = 0;
			if(playRewardAnimate.audioEnd){
				$ani.remove();
				return
			}
		}



		setTimeout( playRewardAnimate, 200,$ani,count);

	}
	/*
	 用户指导
	 * */
	function guideSkills() {
		console.log("guideSkills")
		var $skills = $("footer").find(".skills").parents(".J-dialog");

		$skills.addClass("popToPop").data("guide", true)[0].closeBefore = function () {
			var id = $skills.data("id");
			if (id && $("#" + id).length) {
				var totalHeight = $("#" + id).find(".scrollBody").height();
				var top = $("#" + id).find(".scrollContent").scrollTop() + 3;
				var height = $("#" + id).find(".scrollContent").height();
				if (totalHeight - height < top) {
					guideCharge();
					$skills[0].closeBefore = null;
					return;
				}
				$.tips("您还没查看完");
				return false;
			}
		};

	}


	function guideCharge() {
		console.log("guideCharge")
		var $charge = $("header").find(".charge");
		$charge.addClass("popToPop").data("guide", true)[0].closeBefore = function ($dialog, e) {
			if ($dialog.length && $(e.target).hasClass("J-okBtn") || $(e.target).parents(".J-okBtn").length) {
				var value = $dialog.find("input").val();
				if (value < 100) {
					$.tips("100元起冲");
					return false;
				} else {
					PAGE.ajax({
						type: "post",
						msg: {
							"1": "充值成功",
							"2": "充值发生错误"
						},
						url: "/api/charge?value=" + value,
						success: function () {
							$.tips("充值成功", "success");
							$charge[0].closeBefore = null;
						}, complete: function () {
							guideGlodHouse(guideBuyTuLongDao, guideHandleFengyin);
						}
					})
				}
			} else {
				$.tips("请点击确认充值！");
				return false;
			}
		};
	}

	function guideBuyTuLongDao($dialog) {
		console.log("guideBuyTuLongDao")
		var $tabDaoju = $dialog.find(".tab-head-daoju");
		$tabDaoju.addClass("popToPop");
		$tabDaoju.on("click.guide", function () {
			$tabDaoju.removeClass("popToPop");
			$tabDaoju.off("click.guide");
			$dialog.find(".J-buy-tulongdao").addClass("popToPop");
		});
	}

	function guideGlodHouse(dialogReady, next) {
		console.log("guideGlodHouse")
		var $goldHouse = $("footer").find(".goldHouse");
		$goldHouse.addClass("popToPop").data("guide", true)[0].closeBefore = function ($dialog, e) {
			var isDaojuBuyBtn = $(e.target).hasClass("popToPop") || $(e.target).parents(".popToPop").length;
			if (!isDaojuBuyBtn) {
				return false;
			} else {
				$goldHouse[0].dialogReady = null;
				$goldHouse[0].closeBefore = null;
				next();
			}
		};
		$goldHouse[0].dialogReady = dialogReady;
	}

	function guideHandleFengyin() {
		console.log("guideHandleFengyin")
		var $tree001 = $body.find("#tree001");
		var $fengyin = $tree001.find(".fengyin");
		$tree001.addClass("popToPop").data("guide", true);
		var isconfirm = false;
		$fengyin[0].closeBefore = function ($dialog, e) {
			if (isconfirm) {
				$fengyin[0].closeBefore = null;
				$tree001.removeClass("popToPop");
				guideHandleTrunk();
			} else {
				$.tips("请点击确认！");
				return false;
			}
		}
		$fengyin[0].confirm = function ($dialog) {
			isconfirm = true;
			$fengyin[0].confirm = null;
		}
	}

	function guideHandleTrunk() {
		console.log("guideHandleTrunk")
		var $tree001 = $body.find("#tree001");
		var $trunk = $tree001.find(".trunk");
		$tree001.addClass("popToPop").data("guide", true);
		var isconfirm = false;
		$trunk[0].closeBefore = function ($dialog, e) {
			if (!isconfirm) {
				$.tips("请点击确认！");
				return false;
			} else {
				$trunk[0].closeBefore = null;
				$tree001.removeClass("popToPop");
				guideGlodHouse(guideBuyFertilizer4, guideBuyFertilizer4Again);
			}
		}
		$trunk[0].confirm = function ($dialog) {
			isconfirm = true;
			$trunk[0].confirm = null;
		}
	}

	function guideBuyFertilizer4($dialog) {
		console.log("guideBuyFertilizer4")
		$dialog.find(".J-buy-trunk").addClass("popToPop");
	}

	function guideBuyFertilizer4Again() {
		console.log("guideBuyFertilizer4Again")
		var $tree001 = $body.find("#tree001");
		var $trunk = $tree001.find(".trunk");
		$tree001.addClass("popToPop").data("guide", true);
		var isconfirm = false;
		$trunk[0].closeBefore = function ($dialog, e) {
			if (!isconfirm) {
				$.tips("请点击确认！");
				return false;
			} else {
				$trunk[0].closeBefore = null;
				$tree001.removeClass("popToPop");
				guideEnd();
			}
		}
		$trunk[0].confirm = function ($dialog) {
			isconfirm = true;
			$trunk[0].confirm = null;
		}
	}

	function guideEnd() {
		console.log("guideEnd")

		if (!token) {
			$.tips("未登录！");
			return;
		}
		PAGE.ajax({
			data: {token: token},
			type: 'post',
			msg: {
				"1": "更新成功",
				"2": "校验码为空",
				"3": "校验失败",
				"4": "用户不存在"
			},
			url: "/api/user/guide",
			success: function (ret) {
				$.tips("向导指南结束，祝您玩的愉快！")
				$.cookie("forest_guide", true);
			}
		})
	}


	if (!$.cookie("forest_guide")) {
		guideSkills();
	}
	/*
	 * 显示金币和头像
	 * */
	function showUserInfo() {
		var forest_sex = $.cookie("forest_sex");
		var forest_gold = $.cookie("forest_gold");
		var forest_coin = $.cookie("forest_coin");
		var $header = $("header");
		var $userPic = $header.find(".user-pic");
		var $coin = $header.find(".coin-text");
		var $yuanbao = $header.find(".yuanbao-text");

		$coin.html(forest_coin || 0);
		$yuanbao.html(forest_gold || 0);
		if (forest_sex == 0) {
			$userPic.removeClass("female").addClass("male")
		} else {
			$userPic.removeClass("male").addClass("female")
		}
	}

	/*倒计时*/
	function counter(targetEle, count, callback) {
		$(targetEle).data("counter", count--);

		if (typeof callback == "function") {
			callback(targetEle, count);
		}
		if (count == 0) {
			return;
		}
		clearTimeout(targetEle.timer);
		targetEle.timer = setTimeout(counter, 1000, targetEle, count, callback);
	}

	function initTree() {
		var login_token = $.cookie("login_token");
		if (login_token) {
			PAGE.ajax({
				type: "get",
				url: "/api/trees?token=" + login_token,
				success: function (data) {
					if (data) {
						for (var i = 0; i < data.length; i++) {
							var treeInfo = data[i];
							var $tree = $("#tree" + treeInfo.serial.toString().fill("000"));
							$tree.data("treeinfo", treeInfo);
							// 0未破除封印，1已破除，2已收获，3 需浇生命液进行激活
							switch (treeInfo.status) {
								case "0":
									$tree.html('<div class="trunk bg-renwu"></div><div class="fengyin bg-renwu"></div>');
									break;
								case "1":
									//0化肥
									if (treeInfo.countdown <= 0) {
										updateTreeStatus($tree, treeInfo);

									} else {
										$tree.html('<div class="trunk bg-renwu"></div>');
										counter($tree[0], treeInfo.countdown, function (targetEle, count) {
											if (count <= 0) {
												updateTreeStatus($(targetEle), $(targetEle).data("treeinfo"));
											}

										});
									}

									break;
								case "2":
									$tree.html('<div class="trunk bg-renwu"></div>');
									break;
								case "3":
									$tree.html('<div class="trunk bg-renwu"></div>');
									break;
							}
						}
					}
				},
				error: function () {
					initAllTree();
				}
			})
		} else {
			initAllTree();
		}
	}

	function updateTreeStatus($tree, treeInfo) {
		if (treeInfo.apply_type == 1) {
			$tree.html('<div class="fertilizer4 bg-renwu"><div class=" bg-daoju bg-daoju-hand animate-flow"></div></div>');
		} else if (treeInfo.apply_type == 2) {
			$tree.html('<div class="fertilizer3 bg-renwu"><div class=" bg-daoju bg-daoju-hand animate-flow"></div></div>');
		} else if (treeInfo.apply_type == 3) {
			$tree.html('<div class="fertilizer2 bg-renwu"><div class=" bg-daoju bg-daoju-hand animate-flow"></div></div>');
		} else if (treeInfo.apply_type == 4) {
			$tree.html('<div class="fertilizer1 bg-renwu"><div class=" bg-daoju bg-daoju-hand animate-flow"></div></div>');
		}
	}

	function initAllTree() {
		var $tree;
		for (var i = 1; i < 11; i++) {
			$tree = $("#tree" + i.toString().fill("000"));
			$tree.html('<div class="trunk bg-renwu"></div></div><div class="fengyin bg-renwu"></div>');
		}
	}

	function playRewardCoin(len, count,callback) {
		len = len > 4 ? 4 : len;
		len = len < 1 ? 1 : len;
		var lenCount = len;
		playRewardAnimate.audioEnd = false;
		for (var i = 0; i < len; i++) {

			playAudio("coin",i,count,{time:i*200},function () {
				lenCount--;
				if(lenCount<=0){
					playRewardAnimate.audioEnd = true;
					if(typeof callback=="function"){
						callback();
					}
				}
			});
			playRewardAnimate();
			
		}
	}
	function playAudio(type,i,count,timeObj,callback){

		var src = "";

		if (!audios[type]) {
			audios[type]= [];
		}
		if(	!audios[type][i]	){
			audios[type][i] = new Audio();
		}

		var audio = audios[type][i];
		switch (type){
			case "coin":
				src = "/public/audio/coin.mp3";
				break;
			case "clock":
				src="/public/audio/clock.mp3"
		}
		if(!src){
			return;
		}
		timeObj.timer = setTimeout(function(){
			if(timeObj.lock){
				return;
			}
			if(PAGE.data.audio=="open"){
				if(!audio.init){
					audio.src = src;
					audio.load();
					audio.init = true;
				}
				if(audio.paused){
					audio.play();
				}
				console.log("open")
			}else{console.log("close")

				if(audio.pause){
					audio.pause();
				}
			}

			count--;
			if(PAGE.data.audio=="open"){
			audio.onended=function () {
				if(count<=0){
					if(typeof callback=="function"){
						callback();
					}
					return;
				}
				playAudio(type,i,count,timeObj,callback);
			}}else{
				if(count<=0){
					if(typeof callback=="function"){
						callback();
					}
					return;
				}
				playAudio(type,i,count,timeObj,callback);
			}
		},timeObj.time)

	}
	function playTimerAudio(count,callback){
		var timerObj = {time:500};
		playAudio("clock",0,count,timerObj);
		return timerObj;
	}

	showUserInfo();
	initTree();
	//藏金阁

	/*spa方式切页面时候需要清除全局事件和变量*/
	PAGE.destroy.push(function () {
		$(document).off("mousedown.dragbg touchstart.dragbg")
			.off("mousemove.dragbg touchmove.dragbg")
			.off("mouseup.dragbg touchup.dragbg")
			.off("mousewheel.dragbg")
			.off("WeixinJSBridgeReady")
			.off("click.dragbg", ".J-dialog");
		$(window).off("resize.dragbg");
	});
})();