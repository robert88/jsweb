;(function () {
	var $dialog = 	$(".pocketContent").parents(".dl-dialog");
	var $body = $dialog.find(".scrollBody");
	var $scrollBody = $dialog.find(".scrollContent");
	var $propsItem = $dialog.find("propsInfo");
	var $linshouItem = $dialog.find("linshouInfo");
	var loaded = false;

	//html模板
	function getHtmlTempl(obj) {
		return  ['<li class="mt20">',
			'<div class="title  bg-kuang"><img src="{0}">{1}</div>',
			'<p>{2}</p>',
			'</li>'].join("").tpl(obj.icon,obj.title,obj.introduce);
	}
	
	//加载数据
	$(".loading").show();
	PAGE.ajax({
		type: 'get',
		msg: {
			"1": "成功",
			"2": "没有数据！"
		},
		url: "/api/game/skill",
		success: function (ret) {
			if(ret&&ret.length){
				loaded = true;
				for(var i=0;i<ret.length;i++){
					var data = ret[i];
					var html = getHtmlTempl(data);
					if(data.type==0||data.type==1){
						$propsItem.html(html);
					}else{
						$linshouItem.html(html)
					}
				}

			}else{
				$propsItem.html("无数据！");
				$linshouItem.html("无数据！");
			}

		},error:function () {
			$propsItem.html("数据有误！");
			$linshouItem.html("数据有误！");
		},complete:function () {
			$(".loading").hide();
		}
	});
	


})();