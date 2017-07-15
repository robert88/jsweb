;(function () {
	/*添加hover激活*/
	var $menu = $("#tool-menu");
	var $menuLi = $menu.find(">ul>li");
	var hoverActive = false;
	$menu.on("click",">ul>li",function () {
		if(!hoverActive){
			hoverActive = true;
			$menuLi.removeClass("hoverActive");
		}else{
			hoverActive = false;
		}
		$(this).toggleClass("hoverActive");
	}).on("mouseenter",">ul>li",function (e) {
		if(hoverActive){
			$menuLi.removeClass("hoverActive");
			$(this).addClass("hoverActive");
		}
	}).on("click",">ul>li>dl>dd",function (e) {
		var $this = $(this);
		var handleName = $this.data("handle");
		var handleParams = PAGE.getParamsByUrl($this.data("handle-params"));
		if(typeof menuHandle[handleName]=="function"){
			menuHandle[handleName](e,handleParams);
		}
	});
	PAGE.on("click.hoverActive",document,function (e) {
		if($menu.find(e.target).length==0){
			hoverActive = false;
			$menuLi.removeClass("hoverActive");
		}
	});

	/*处理菜单响应*/
	var menuHandle ={
		createFile:function (e,params) {
			$.dialog("url:tool/dialog/createFile.html",{title:"创建action",width:500,height:400,maskClose:false,draggable:true,resize:true});
		}
	}
}());