/*
* 拖动框架
* */
;(function () {


	$.fn.draggable=function () {

		return this.addClass("draggable-trigger");

	}


	function toFloat(val) {
		return parseFloat(val,10)||0
	}
	initDrag()
	function initDrag(){

		var down,dx,dy,px,py,$target;
		$(document).on('mousedown','.draggable-trigger',function (e) {
			$target = $(this);
			down = true;
			dx = e.pageX;
			dy = e.pageY;
			px = toFloat( $target.css("left"));
			py = toFloat( $target.css("top"));
			$(document).on("selectstart",function(){return false;});
			return false
		}).on('mousemove', function (e) {
			var x = event.pageX;
			var y = event.pageY;
			if(down){
				$target.css({
					left: x -dx +px,
					top: y - dy+py
				});
			}
		}).bind("mouseup",function (e) {
			down = false;
			$target = null
			$(document).off("selectstart",function(){return false;});
		})
	}


})();
