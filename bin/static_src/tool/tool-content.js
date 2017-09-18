;(function () {
	var $zoomWrap = $(".edit-wrap");//scale外框
	var $zoomTarget = $zoomWrap.find(".edit-page")//scale对象
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
			$zoomWrap.height(winH-$zoomWrap.offset().top-10);
			resizeContent();
			perH = winH;
		}
	}
	resizePage();
	function makePositive(d){
		return d>0?d:0
	}
	function getResizeSize(value,realvalue,max,min){
		value = PAGE.getRagen();
		return Math.floor(value/realvalue*100);
	}
	var perWrapw,perWraph;
	function resizeContent(){
		var w = $zoomWrap.width();
		var h = $zoomWrap.height();
		if( perWrapw != w || h != perWraph){
			
		}
	}
}());
