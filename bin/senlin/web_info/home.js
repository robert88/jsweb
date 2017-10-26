;(function () {
	PAGE.data = PAGE.data || {};
	PAGE.data.audio = PAGE.data.audio || "open";
	var $body = $(".J-body");
	var dx, dy, dflag, ex, ey, dw, dh;
	/*缩小*/
	var audios = {};
	var currZoom = 1;//最小的状态显示
	var perDr;
	var scaleTimer = 0;
	var token = $.cookie("login_token");
	var $header = $("header");
	var $userPic = $header.find(".user-pic");
	var $coin = $header.find(".coin-text");
	var $gold = $header.find(".gold-text");
	var $charge = $header.find(".charge");
	var $footer = $("footer");
	var $pocket = $footer.find(".pocket");
	var $goldHouse = $footer.find(".goldHouse");
	var $skills = $footer.find(".skills").parents(".J-dialog");

	if (!token) {
		hash="#web_info/login";
	}

	function initDrag() {
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
			if (!$.cookie("forest_guide") && !$this.data("guide") || $this.data("lock")) {
				return;
			}

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
	}


	/*倒计时*/
	function counter(targetEle, count, callback) {

		//配合targetEle.timer
		if($("body").find(targetEle).length==0){
			return;
		}
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

	//缩放---------------------------------------------------------------------------
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


	//播放声音---------------------------------------------------------------------------
	/*
	 * 循环播放
	 * */
	function cricle(count,timeObj,audio,callback){


		if (timeObj.lock) {
			return;
		}
		//播放停止，不能用onend因为可能播放同一个audio在处理不同的事务,必须放在play之前，防止死循环
		if (audio.paused) {
			count--;
		}
		//设置音效是打开的。
		if (PAGE.data.audio == "open") {
			if (audio.paused) {
				audio.play();
			}
		} else {
			if (audio.pause) {
				audio.pause();
			}
		}

		if (count <= 0 || !count) {
			if (typeof callback == "function") {
				callback();
			}
			return;
		}

		setTimeout(cricle,timeObj.time,count,timeObj,audio,callback);
	}
	/*
	 * type播放的声音类型，i表示全局存储的audio索引，count播放的次数，callback播放完毕
	 * */
	function playAudio(type, i, count, timeObj, callback) {

		var src = "";
		switch (type) {
			case "coin":
				src = "/public/audio/coin.mp3";
				break;
			case "clock":
				src = "/public/audio/clock.mp3"
		}
		if (!src) {
			return;
		}
		if (!audios[type]) {
			audios[type] = [];
		}
		if (!audios[type][i]) {
			audios[type][i] = new Audio();
		}
		var audio = audios[type][i];

		if (!audio.init && audio.src!=src) {
			audio.src = src;
			audio.load();
			audio.init = true;
		}

		setTimeout(cricle,timeObj.time,count,timeObj,audio,callback);
	}

	/*
	 * 弹出窗confirm
	 * */
	PAGE.data.confirm = function (msg,confirm,cancel) {
		return $.dialog("<div class='bg-title bg-title-confirm'></div><div style='text-align: center;margin-top: 58px;'>"+msg+"</div>",
			{
				width: 330,
				dialogClass: "smallDialog",
				maskClose: false,
				close: false,
				footerStyle: "bottom: 15px;",
				button: [
					{
						text: '<span class="btn-tab"><span class="text-gradient" data-text="确认">确认</span></span>',
						click: confirm
					},
					{
						text: '<span class="btn-tab-active ml10"><span class="text-gradient" data-text="取消">取消</span></span>',
						className: "cancelBtn",
						click: cancel
					}
				]
			});
	}
	/*
	 * 显示金币和头像
	 * */
	function showUserInfo() {
		if (!token) {
			window.location.hash="#/web_info/login";
			return;
		}

		var forest_sex = $.cookie("forest_sex");
		var forest_gold = $.cookie("forest_gold");
		var forest_coin = $.cookie("forest_coin");

		$coin.html(forest_coin || 0);
		$gold.html(forest_gold || 0);
		if (forest_sex == 0) {
			$userPic.removeClass("bg-user-female").addClass("bg-user-male")
		} else {
			$userPic.removeClass("bg-user-male").addClass("bg-user-female")
		}
	}
	/*
	 * 显示摇钱树全部没有破产封印
	 * */
	function initAllTree() {
		var $tree;
		for (var i = 1; i < 11; i++) {
			$tree = $("#tree" + i.toString().fill("000"));
			$tree.html('<div class="trunk bg-renwu"></div></div><div class="seal bg-renwu"></div>');
		}
	}
	/*
	 * 显示施了对于化肥之后的成熟的摇钱树
	 * */
	function updateTreeStatus($tree, treeInfo) {
		if (treeInfo.apply_type == 1) {
			$tree.html('<div class="fertilizer4 bg-renwu"><div class=" bg-props bg-props-hand animate-flow"></div></div>');
		} else if (treeInfo.apply_type == 2) {
			$tree.html('<div class="fertilizer3 bg-renwu"><div class=" bg-props bg-props-hand animate-flow"></div></div>');
		} else if (treeInfo.apply_type == 3) {
			$tree.html('<div class="fertilizer2 bg-renwu"><div class=" bg-props bg-props-hand animate-flow"></div></div>');
		} else if (treeInfo.apply_type == 4) {
			$tree.html('<div class="fertilizer1 bg-renwu"><div class=" bg-props bg-props-hand animate-flow"></div></div>');
		}
	}
	/*
	 * 显示摇钱树
	 * */
	function initTree() {
			PAGE.ajax({
				type: "get",
				url: "/api/trees?token=" + token,
				success: function (data) {
					if (data&&data.length) {
						for (var i = 0; i < data.length; i++) {
							var treeInfo = data[i];
							var $tree = $("#tree" + treeInfo.serial.toString().fill("000")).data("treeinfo", treeInfo);

							// 0未破除封印，1已破除，2已收获，3 需浇生命液进行激活
							switch (treeInfo.status) {
								case "0":
									$tree.html('<div class="trunk bg-renwu"></div><div class="seal bg-renwu"></div>');
									break;
								case "1":
									//已经成熟了
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
								case "3":
									$tree.html('<div class="trunk bg-renwu"></div>');
									break;
							}
						}
					}else{
						initAllTree();
					}
				},
				error: function () {
					initAllTree();
				}
			})
	}
	/*
	 * 处理封印,不能用data("treeinfo")
	 * */
	function handleBreakseal($treeItem,$seal) {
		var treeId = $treeItem.attr("id");
		var serial = parseInt(treeId.replace("tree",""),10);
		PAGE.data.confirm("是否破除封印？",function (e, $dialog) {
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
				url: "/api/trees/relieve?serial=" + serial +"&token=" + token,
				success: function () {
					$.tips("成功破除", "success");
					$seal.remove();
					if(PAGE.guide.needGuide && PAGE.guide.step=="breakSeal"){
						PAGE.guide.next();
					}
				},complete:function () {
					$.dialog.close($dialog);
				}
			});
			//阻止关闭窗口
			return false;
		});
	}
	/*
	 * 施肥
	 * */
	PAGE.data.applyFertilizer = function ($dialog) {


		var serial = PAGE.data.selectSerial;
		var pid = PAGE.data.selectFertilizerId;

		var $treeItem = $("#tree" + serial.toString().fill("000"));
		var treeInfo = $treeItem.data("treeinfo");

		if(treeInfo.status==3 ){
			$.tips("该摇钱树需要浇灌生命药水！");
			return;
		}

		if(serial==null){
			$.dialog.close($dialog);
			$.tips("请选择要施肥的摇钱树！");
			return;
		}
		if (pid==null) {
			$.dialog.close($dialog);
			$pocket.data("guide", true);
			$pocket.click();
			//需要施加生命药水
			$.tips("请选择化肥类型！");
			return;
		}
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
			url: "/api/trees/apply?serial=" + treeInfo.serial+ "&token=" + token + "&property_id=" + pid,
			success: function (ret) {
				$.tips("施肥成功", "success");
				PAGE.data.selectSerial = null;
				PAGE.data.selectFertilizerId = null;
				//新手指引
				if(PAGE.guide.needGuide && PAGE.guide.step=="fertilizer"){
					PAGE.guide.next();
				}
				$.dialog.close($dialog);
				$treeItem.data("treeinfo",ret);
				counter($treeItem, ret.countdown);
			}
		});
	};
	/*
	* 浇灌生命药水
	* */
	function applyLife() {
		PAGE.ajax({
			type: "post",
			msg: {
				"-1": "暂无生命液",
				"0": "登录token验证失败",
				"1": "成功浇生命液",
				"2": "摇钱树编号错误",
				"3": "摇钱树不存在",
				"4": "摇钱树不需要生命液"
			},
			url: "/api/trees/life?serial=" + treeInfo.serial+ "&token=" + token + "&property_id=" + pid,
			success: function () {
				$.tips("成功浇生命液", "success");
			},errorCallBack:function (text, type, tipsType, ret) {
				if(ret.code==-1){
					PAGE.data.confirm("您的包裹里没有生命液，为您跳转到藏经阁。",function (e, $dialog) {
						$goldHouse.data("guide",true).click();
					});
				}
			}
		});
	}
	/*
	 * 点击摇钱树树干,施肥，查看状态,serial只能用id中值
	 * */
	function handletrunk( $treeItem) {

		var treeInfo = $treeItem.data("treeinfo");
		var treeId = $treeItem.attr("id");
		var serial = parseInt(treeId.replace("tree",""),10);

		//提示倒计时
		if ($treeItem.data("counter")) {
			var $dilaog = $.tips("摇钱树距离下一个阶段的成长还有<span class='counter'>" + $treeItem.data("counter") + "</span>", "warn", 5000);
			counter($dilaog.find(".counter"), $treeItem.data("counter"), function (ele, count) {

				var day = Math.floor(count/24/60/60);
				var hours = Math.floor((count - day*24*60*60)/60/60);
				var minute = Math.floor((count - day*24*60*60-hours*60*60)/60);
				if(count<60){
					count = count + "秒";
				}else{
					count =(day>0&&(day+" 天 ")||" ") +  (hours>0&&(hours+" 时 ")||" ")  + (minute>0&&(minute+" 分 ")||" ");
				}
				$(ele).html(count);
				playAudio("clock", 0, 1, {time: 50});
			});
			return
		}

		if(treeInfo&&treeInfo.status==3 ){
			msg =  "摇钱树编号："+treeId.replace("tree","") + "需要浇灌生命药水！"
		}else if(treeInfo&&treeInfo.status==2){
			msg = "是否继续为编号：" + treeId.replace("tree","") + "的摇钱树施肥？"
		}else{
			msg = "是否为编号：" + treeId.replace("tree","") + "的摇钱树施肥？"
		}
		PAGE.data.confirm(msg,function (e, $dialog) {
			PAGE.data.selectSerial = serial;
			if(treeInfo&&treeInfo.status==3 ){
				applyLife($dialog)
			}else{
				PAGE.data.applyFertilizer($dialog);
			}
			//阻止关闭窗口
			return false;
		});
	}
	/*
	*收获动画
	**/
	function playRewardAnimate($ani, count) {
		var arr = ["0", "-130px 0px", "-260px 0px", " -390px 0px", "-520px 0px", "0px -280px", "-130px -280px", "-260px -280px", "-390px -280px", "-520px -280px", "-1000px -1000px"]
		if (!$ani) {
			$ani = $("<div class='bg-banquetfiy'></div>").appendTo("body");
		}
		if (typeof count == "undefined") {
			count = 0;
			$ani.css("left", (10 * Math.random() + 45) + "%")
		}
		count++;

		$ani.css("background-position", arr[count]);

		if (count >= arr.length - 1) {
			count = 0;
			if (playRewardAnimate.audioEnd) {
				$ani.remove();
				return
			}
		}

		setTimeout(playRewardAnimate, 200, $ani, count);

	}
	/*
	 * 收获语音及触发动画
	 * */
	function playRewardCoin(len, count, callback) {
		len = len > 4 ? 4 : len;
		len = len < 1 ? 1 : len;
		var lenCount = len;
		playRewardAnimate.audioEnd = false;
		for (var i = 0; i < len; i++) {

			playAudio("coin", i, count, {time: i * 200}, function () {
				lenCount--;
				if (lenCount <= 0) {
					playRewardAnimate.audioEnd = true;
					if (typeof callback == "function") {
						callback();
					}
				}
			});
			playRewardAnimate();
		}
	}
	/*
	* 收获
	* */
	function handleReward($tree) {

		if ($tree.find(".bg-props-hand")) {
			$tree.data("lock", true);
			var treeInfo = $tree.data("treeinfo");
			PAGE.ajax({
				type: "get",
				msg: {
				"0" :"登录token验证失败",
						"1" :"收获成功",
						"2": "摇钱树编号错误",
						"3": "摇钱树不存在",
						"4" :"摇钱树还未成熟",
						"5": "摇钱树非收获时期"
				},
				url: "/api/trees/collect?serial=" + treeInfo.serial+"&token="+token,
				success: function (ret) {
					var forest_gold = $.cookie("forest_gold");
					var forest_coin = $.cookie("forest_coin");
					var coin = ret.coin||0;
					var gold = ret.gold ||0;
					$coin.html((forest_coin*1+coin*1) || 0);
					$gold.html((forest_gold*1 + gold*1) || 0);
					$.tips("恭喜收获"+coin+"金币和"+gold+"元宝！", "success");
					playRewardCoin(treeInfo.apply_type, 10, function () {
						$tree.data("lock", false);
						$tree.html('<div class="trunk bg-renwu"></div>');
					});
				},errorCallBack:function () {
					$tree.data("lock", false);
				}
			});
		}
	}
	/*
	 * 点击摇钱树
	 * */
	function initTreeEvent() {
		$body.on("click", ".treeItem", function () {
			var $this = $(this);
			if (PAGE.guide.needGuide && !$this.data("guide") || $this.data("lock")) {
				return;
			}
			var $seal = $this.find(".seal");
			var $trunk = $this.find(".trunk");
			if ($seal.length) {
				handleBreakseal($this,$seal);
			} else if ($trunk.length) {
				handletrunk( $this,$trunk);
			} else {
				handleReward($this)
			}
	
		});
	}

	//新用户指导----------------------------------------------------------------------------------
	/*
	 * 新用户指导
	 * */
	function initGuide() {
		PAGE.guide = {};
		PAGE.guide.handler = [];
		//触发下一个步骤
		PAGE.guide.next=function () {
			$(".popToPop").removeClass("popToPop");
			var handler = PAGE.guide.handler.shift();
			if(handler){
				PAGE.guide.step = handler.name;
				handler.func();
			}
		};
		if (!$.cookie("forest_guide")) {
			PAGE.guide.needGuide = true;
			//step1
			PAGE.guide.handler.push({func:guideSkills,name:"skills"});
			//step2
			PAGE.guide.handler.push({func:guideCharge,name:"charge"});
			//step3
			PAGE.guide.handler.push({func:guideGoldHouse,name:"goldHouse"});
			//step4
			PAGE.guide.handler.push({func:guideTree,name:"breakSeal"});
			//step5
			PAGE.guide.handler.push({func:guideTree,name:"fertilizer"});
			//step6
			PAGE.guide.handler.push({func:guideEnd,name:"guideEnd"});
			//执行step1
			PAGE.guide.next();
		}

	}

	/*
	 *阅读游戏说明
	 * */
	function guideSkills() {
		$skills.addClass("popToPop").data("guide", true);
	}

	/*
	 *充值
	 * */
	function guideCharge() {
		$charge.addClass("popToPop").data("guide", true);
	}
	/*
	 *藏经阁
	 * */
	function guideGoldHouse() {
		$goldHouse.addClass("popToPop").data("guide", true);
	}
	/*破除封印->施肥*/
	function guideTree() {
		$body.find("#tree001").addClass("popToPop").data("guide", true);
	}
	/*记录新手指南*/
	function guideEnd() {
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
			success: function () {
				$.tips("向导指南结束，祝您玩的愉快！")
				$.cookie("forest_guide", true);
				PAGE.guide.needGuide = false;
			}
		})
	}

	//初始化----------------------------------------------------------------------------------
	
	showUserInfo();
	initTree();
	initTreeEvent();
	initDrag();
	zoomBody();
	initGuide();


})();