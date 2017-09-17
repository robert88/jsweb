;(function () {
	var $pageWrap = $(".edit-wrap");
	var timer;
	PAGE.on("resize",window,function () {
		PAGE.clearTimeout(timer);
		 timer = PAGE.setTimeout(function () {
			resizePage();
		},17);
	});
	var perH;
	function resizePage(){
		var winH = $(window).height();
		if(winH!=perH){
			$pageWrap.height(winH-$pageWrap.offset().top-10);
			perH = winH;
		}
	}
	resizePage();
}());