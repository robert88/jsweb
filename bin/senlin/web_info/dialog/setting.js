;(function () {
	PAGE.data.audio = PAGE.data.audio||"open";
	var $dialog = 	$(".settingContent").parents(".dl-dialog");
	$dialog.on('click',".videoSetting",function () {

		if(PAGE.data.audio=="open"){
			PAGE.data.audio = "close";
			$(this).removeClass("on").addClass("off")
		}else{
			PAGE.data.audio = "open";
			$(this).removeClass("off").addClass("on")
		}
	})
})();