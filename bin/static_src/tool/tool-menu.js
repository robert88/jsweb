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
			menuHandle[handleName](e,handleParams,$this);
		}

	});
	PAGE.on("click.hoverActive",document,function (e) {
		if($menu.find(e.target).length==0){
			hoverActive = false;
			$menuLi.removeClass("hoverActive");
		}
	});

	/*显示眼睛*/
	function toggleEye($target){
		var $icon = $target.find(".toggle-icon");
		if($icon.length){
			$icon.remove();
		}else{
			$target.prepend("<i class='toggle-icon icon-eye'></i>")
		}
	}

	/*处理菜单响应*/
	var menuHandle ={
		createFile:function (e,params) {

			var $dialog = $.dialog("url:tool/dialog/createFile.html",
				{
					title: "创建action",
					width: 500,
					height: "auto",
					maskClose: false,
					draggable: true,
					changeSize: true,
					ready: function () {
						$("body").find(".J-submitBtn").removeClass("J-submitFocus");
						$dialog.find(".J-submitBtn").addClass("J-submitFocus");
						var validForm = PAGE.validForm({
							validSuccess:function ($form) {
								debugger
								PAGE.ajax({
									url:"/ajax/index/getCode",
									success:function (ret) {
										$.tips("suceess");
									}
								})
							},
							form:$dialog.find("form")
						});
						var validRule = validForm("getRule");
						validRule["checkFile"] = {
							check:function(value, $obj) {

								//传递了比较值
								var acceptTypes = $obj.data("accept-file").split(",");
								var pointIndex = value.lastIndexOf(".")+1;
								if(!pointIndex){
									return true;
								}
								var ret = true;
								var type = value.slice(pointIndex);
								$.each(acceptTypes,function (idx,acceptType) {
									acceptType = acceptType.trim();
									if(acceptType==type){
										ret = false;
									}
								});
								return ret;
							},
							defaultMsg:"i18n.invalid.file.type"

						}
						$dialog.css({"max-height":"500px","min-width":"570px","min-height":"180px"});
					}
				});
		},
		toggleGrid:function (e,params,$target) {
			toggleEye($target);
		},
		toggleRuler:function (e,params,$target) {
			toggleEye($target);
		},
		toggleTool:function (e,params,$target) {
			toggleEye($target);
		}
	}
}());