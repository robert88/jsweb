;(function () {
	var $body = $(".J-body");
	var dx,dy,dflag,ex,ey,dw,dh;
	/*缩小*/
	var currZoom = 100;
	$(document).off("mousedown.dragbg").on("mousedown.dragbg",function(e){
		dflag = true;
		dx = $body.css("left").toFloat();
		dy = $body.css("top").toFloat();
		ex = e.pageX;
		ey = e.pageY;
		dw = $(window).width()-1500*currZoom/100;
		dh = $(window).height()-1500*currZoom/100;
		return false;
	}).off("mousemove.dragbg").on("mousemove.dragbg",function (e) {
		if(dflag){
			var tx = e.pageX - ex +dx;
			var ty = e.pageY - ey +dy;

			tx = tx<dw?dw:tx;
			ty = ty<dh?dh:ty;
			tx = tx>0?0:tx;
			ty = ty>0?0:ty;
			$body.css("left",tx + "px");
			$body.css("top",ty + "px");
		}
	}).off("mouseup.dragbg").on("mouseup.dragbg",function (e) {
		dflag = false;
	}).off("mousewheel.dragbg").on("mousewheel.dragbg", function(evt) {

		var wheelDelta = evt.wheelDelta || evt.detail;

		//jquery bug； zepto没这个问题
		if(!wheelDelta && evt.originalEvent) {
			evt = evt.originalEvent;
			wheelDelta = evt.wheelDelta || evt.detail;
		}
		//没有滚动条
		if(wheelDelta <0 || wheelDelta == 3) {
			reduceImage();

		} else if(wheelDelta >0 || wheelDelta == -3) {
			zoomImage();
		}

		return false;
	}).off("resize.dragbg").on("resize.dragbg", function(evt) {
		zoomBody()
	});

	zoomBody();


	function reduceImage(){
		currZoom--;
		zoomBody()
	}
function zoomBody(){
	var offsetX = $body.css("left").toFloat(0);
	var offsetY = $body.css("top").toFloat(0);
	var zoomx = $(window).width()/(1500)*100;
	var zoomy = $(window).height()/(1500)*100;
	var minZoom = Math.max(zoomx,zoomy);
	var maxZoom = Math.max(minZoom,100);
	if(currZoom<minZoom){
		currZoom=minZoom;
	}
	if(currZoom>maxZoom){
		currZoom=maxZoom;
	}
	if(currZoom>100){
		offsetX = 0;
		offsetY = 0;
	}else{
		offsetX = offsetX*currZoom/100
		offsetY = offsetY*currZoom/100
	}
	$body.css({
		"transform":"scale("+currZoom/100+","+currZoom/100+")",
		left:offsetX,
		top:offsetY
	});
}
	/*放大*/
	function zoomImage(){
		currZoom++;
		zoomBody()
	}
})();