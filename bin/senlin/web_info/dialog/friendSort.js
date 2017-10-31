;(function () {
	var $dialog = 	$(".friendSortContent").parents(".dl-dialog");
	var token = $.cookie("login_token");
	if (!token) {
		PAGE.setUrl("#/web_info/login.html");
		return;
	}
	//好友html模板
	function getHtmlTempl(obj,sort) {
		return  ['<div class="col3">{0}</div>',
			'<div class="col3">{1}</div>',
			'<div class="col3">{2}</div>',
			'<div class="col3">{3}</div>'].join("").tpl(sort,obj.name,obj.treasure||0,obj.steal==1?'<div class=" bg-props bg-props-hand animate-flow"></div>':"");

	}
	//灵兽html模板
	function getHtmlTempl2(obj,sort) {
		return  ['<div class="col3">{0}</div>',
			'<div class="col3">{1}</div>',
			'<div class="col3">{2}</div>',
			'<div class="col3">{3}</div>'].join("").tpl(sort,obj.nickname,obj.name,obj.rank);

	}
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
					"2":"暂无好友"
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
		});
		getData();
	}

	initSort($dialog.find(".J-firendSortList"),"/api/game/friend",getHtmlTempl);
	initSort($dialog.find(".J-animalSortList"),"/api/game/fanimal",getHtmlTempl2);

})();