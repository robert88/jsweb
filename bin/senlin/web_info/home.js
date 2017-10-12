;(function () {
	var $body = $(".J-body");
	var dx,dy,dflag,ex,ey,dw,dh;
	/*缩小*/

	var currZoom = 1;//最小的状态显示
	var perDr;
	var scaleTimer =0;
	$(document).off("mousedown.dragbg touchstart.dragbg").on("mousedown.dragbg touchstart.dragbg",function(e){
		if(e.type ==="touchstart"){
			e = e.originalEvent.touches[0];
		}
		dflag = true;
		dx = $body.css("left").toFloat();
		dy = $body.css("top").toFloat();
		ex = e.pageX;
		ey = e.pageY;
		dw = $(window).width()-1500*currZoom/100;
		dh = $(window).height()-1500*currZoom/100;
		//手机端需要处理缩放不能屏蔽掉默认事件
		if(e.type !=="touchstart"){
			return false;
		}
	}).off("mousemove.dragbg touchmove.dragbg").on("mousemove.dragbg touchmove.dragbg",function (e) {
		if(dflag){
			if(e.type ==="touchmove"){
				var touches = e.originalEvent.touches;
				e=e.originalEvent.touches[0];
				if(touches.length>1){
					//每隔5次触发一次缩放
					if(scaleTimer==0){
						scaleZoom(e,touches[1]);
					}
					scaleTimer++;
					if(scaleTimer>4){scaleTimer=0}
					return ;
				}
			}
			var tx = e.pageX - ex +dx;
			var ty = e.pageY - ey +dy;

			tx = tx<dw?dw:tx;
			ty = ty<dh?dh:ty;
			tx = tx>0?0:tx;
			ty = ty>0?0:ty;
			$body.css("left",tx + "px");
			$body.css("top",ty + "px");
		}
	}).off("mouseup.dragbg touchup.dragbg").on("mouseup.dragbg touchup.dragbg",function (e) {
		perDr = null;
		dflag = false;
	//电脑端滚轮缩放
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

		// return false;
	}).off("click.dragbg",".J-dialog").on("click.dragbg",".J-dialog", function(evt) {
		var $this = $(this);
		var url = $this.data("url");
		var dialogId = $this.data("id");
		if(url){
			$(".loading").show();
			$.dialog("url:"+url,{width:330,id:(dialogId?dialogId:""),close:false,button:[{text:"",className:"backBtn"}],ready:function ($dialog) {
				$(".loading").hide();
			}});
		}
	});

	$(window).off("resize.dragbg").on("resize.dragbg", function(evt) {
		zoomBody()
	});

	/*缩放到最适合屏幕的大小*/
	zoomBody();

	/*手机端缩放*/
	function scaleZoom(e1,e2){
		var dex1 = e1.pageX;
		var dey1 = e1.pageY;
		var dex2 = e2.pageX;
		var dey2 = e2.pageY;
		var dr = Math.sqrt( (dex1-dex2)*(dex1-dex2) + (dey1-dey2)*(dey1-dey2) );
		//$.tips(dr)
		if( perDr ){
			if(dr-perDr>0){
				zoomImage();
			}else{
				reduceImage();
			}
			perDr = dr;
		}

		if(perDr==null){
			perDr = dr;
		}

	}

	/*缩放是根据当前窗口的大小来缩放*/
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
		offsetX = offsetX*currZoom/100;
		offsetY = offsetY*currZoom/100;
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
	/*缩小*/
	function reduceImage(){
		currZoom--;
		zoomBody()
	}
	/*spa方式切页面时候需要清除全局事件和变量*/
	PAGE.destroy.push(function(){
		$(document).off("mousedown.dragbg touchstart.dragbg")
			.off("mousemove.dragbg touchmove.dragbg")
			.off("mouseup.dragbg touchup.dragbg")
			.off("mousewheel.dragbg")
			.off("click.dragbg",".J-dialog");
		$(window).off("resize.dragbg");
	})
/*
注册过来的需要显示用户如何操作
* */
	var from = /from=(register)/g.exec(window.location.hash.split("?")[1]);
	if(from&&from[1]){
		from = from[1];
	}
	if(from == "register"){
		$("footer").find(".skills").parents(".J-dialog").click();
	}
})();