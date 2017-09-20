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
		value = PAGE.getRagen(value,max,min)
		return Math.floor(value/realvalue*100);
	}
	var perWrapw,perWraph;
	function resizeContent(){
		var w = $zoomWrap.width();
		var h = $zoomWrap.height();
		if( perWrapw != w || perWraph != h){
			var widthzoom = getResizeSize(w,1211,1800,1024);
			var heightzoom = getResizeSize(h,619,900,500);
			$zoomTarget.data("fullzoom",Math.min(widthzoom,heightzoom));
			zoomPage();
			perWrapw = w;
			perWraph = h
		}
	}
	function zoomPage(value){
		var fullzoomvalue = $zoomTarget.data("fullzoom");
		var reportmodevalue=  $zoomTarget.data("reportzoom");
		var setZoom = $zoomTarget.data("setzoom")
		value = value || reportmodevalue || setZoom || fullzoomvalue;

		if(!value){
			console.error("zoom value ==0");
			return;
		}
		var rate = value/100;
		var zoomOriginSize = {w:1211,h:619};//原始大小
		var zoomSize = {w:rate*zoomOriginSize.w,h:rate*zoomOriginSize.h}//缩放之后的大小
		var wrapSize = {w:$zoomWrap.width(),h:$zoomWrap.height()};//外框大小
		var zoomOffset ={x:makePositive(zoomOriginSize.w*(1-rate)/2),y:makePositive(zoomOriginSize.h*(1-rate)/2)};//相对原点的偏移
		var center ={x:makePositive(wrapSize.w-zoomSize.w)/2,y:makePositive(wrapSize.h-zoomSize.h)/2};//居中位置
		var translate = {x:(center.x-zoomOffset.x)/rate,y:(center.y-zoomOffset.y)/rate};//缩放之后的偏移
		if(value>100){
			$zoomTarget.addClass("contentscale");
		}else{
			$zoomTarget.removeClass("contentscale");
		}

		if(value>fullzoomvalue){
			$zoomWrap.css("overflow","auto");
		}else{
			$zoomWrap.css("overflow","hidden").scrollTop(0).scrollLeft(0);
		}
		$zoomTarget.css("transform","scale("+value/100+","+value/100+")"+"translate("+Math.floor(translate.x)+"px,"+Math.floor(translate.y)+"px)");
	}
}());
