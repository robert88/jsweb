;(function () {
	var $dialog = 	$(".noticeContent").parents(".dl-dialog");
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	//综合
	function logTempl(obj,sort) {
		return  ['<div class="col02">{0}</div>',
			'<div class="col08 tl"><a class="J-dialog" style="display: block;"  data-url="/web_info/dialog/log.html?id={1}">{2}</a></div>'].join("").tpl(sort,obj.id,obj.title);

	}
	//充值记录		"id": 12,
	function paylogTempl(obj,sort) {
		return  ['<div class="col02">{0}</div>',
			'<div class="col02">{1}</div>',
			'<div class="col06">{2}</div>'].join("").tpl(sort,obj.body,obj.orderNo);
	}
	//操作记录
	function operatelogTempl(obj,sort) {
		return  ['<div class="col02">{0}</div>',
			'<div class="col08 tl"><a class="J-dialog" style="display: block;"  data-url="/web_info/dialog/log.html?id={1}">{2}</a></div>'].join("").tpl(sort,obj.id,obj.note);

	}
	//分享记录
	var  sharelogTempl = operatelogTempl;

	function initSort($content,url,htmlTempl) {
		var page = 1;
		var pagesize=10;
		var totalpage;
		var perPage;
		function getData(){
			if(perPage==page){
				return;
			}
			perPage = page;
			$(".loading").show();
			$content.find(".sortInfo li").html("");
			PAGE.ajax({
				type: "get",
				msg: {
					"0":"登录token验证失败",
					"1": "请求成功",
					"2":"暂无记录"
				},
				url: url+"?page=" + page+"&pagesize="+pagesize+"&token="+token,
				success: function (ret) {
					if(ret&&ret.list&&ret.list.length){
						for(var i=0;i<ret.list.length;i++){
							var sort = (i+(page-1)*pagesize);
							$content.find(".sortInfo li").eq(i).html(htmlTempl(ret.list[i],sort));
						}
						totalpage = ret.pages;
						//上榜
						if(ret.ranking&&ret.ranking!=-1){
							$content.find(".sortInfoControl .ranking").html(ret.ranking);
						}else{
							$content.find(".sortInfoControl .ranking").html("未上榜");
						}
						$content.find(".sortInfoControl .page").html(page);
						$content.find(".sortInfoControl .totalpage").html(totalpage);
					}

				},complete:function () {
					$(".loading").hide();
				}
			})
		}

		$content.on("click",".sortInfoControl .next",function () {
			page++;
			if(totalpage&& page>totalpage){
				page = totalpage;
			}
			getData();
		}).on("click",".sortInfoControl .prev",function () {
			page--;
			if(page<1){
				page = 1;
			}
			getData();
		}).on("click",".clearAll",function () {
			$content.find(".sortInfo li").html("");
		});
		getData();
	}

	initSort($dialog.find(".J-log"),"/api/log",logTempl);
	initSort($dialog.find(".J-paylog"),"/api/log/pay",paylogTempl);
	initSort($dialog.find(".J-operatelog"),"/api/log/operate",operatelogTempl);
	initSort($dialog.find(".J-sharelog"),"/api/log/share",sharelogTempl);

})();