;(function () {
	var $content = $(".goldHouse");
	var $dialog = $content.parents(".dl-dialog");
	$content.on("click",".list-btn",function (e) {
		$.dialog.close($dialog,e);
	})

})();