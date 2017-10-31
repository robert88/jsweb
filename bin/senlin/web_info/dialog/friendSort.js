;(function () {
	var $dialog = 	$(".friendSortContent").parents(".dl-dialog");
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	//html模板
	function getHtmlTempl(obj,sort) {
		return  ['<div class="col03">{0}</div>',
			'<div class="col03">{1}</div>',
			'<div class="col03">{2}</div>',
			'<div class="col03">{3}</div>'].join("").tpl(sort,obj.name,obj.treasure||0,obj.steal==1?'<div class=" bg-props bg-props-hand animate-flow"></div>':"");

	}
	var page = 1;
	var pagesize=10;
	var totalpage;
	var perPage;
	function initSort(){
		if(perPage==page){
			return;
		}
		perPage = page;
		$(".loading").show();
		$dialog.find(".sortInfo li").html("");
		PAGE.ajax({
			type: "get",
			msg: {
				"0":"登录token验证失败",
				"1": "请求成功"
			},
			url: "/api/game/friend?page=" + page+"&pagesize="+pagesize+"&token="+token,
			success: function (ret) {
				$(".loading").hide();
				if(ret&&ret.list&&ret.list.length){
					for(var i=0;i<ret.list.length;i++){
						$dialog.find(".sortInfo li").eq(i).html(getHtmlTempl(ret.list[i],i+(page-1)*pagesize));
					}
					totalpage = ret.pages;
					$dialog.find(".sortInfoContrl .page").html(page);
					$dialog.find(".sortInfoContrl .totalpage").html(totalpage);
				}

			}
		})
	}
	$dialog.on("click",".sortInfoContrl .next",function () {
		page++;
		if(totalpage&& page>totalpage){
			page = totalpage;
		}
		initSort();
	}).on("click",".sortInfoContrl .prev",function () {
		page--;
		if(page<1){
			page = 1;
		}
		initSort();
	});

	initSort();

})();