;(function(){
	
	if(!$.fn.changeSize){
		$.fn.changeSize = function(type){
			
			return this.each(function(val,idx){
				var flag = $(this).data("resize")
				if(type=="disable"&&flag===true){
					$(this).data("resize",false);
				}else if(type!="disable"&& !flag){
					$(this).data("resize",true);
					var dir =["top","left","right","bottom","leftTop","rightTop","rightBottom","leftBottom"];
					var temp=[];
					$.each(dir,function (idx,val) {
						temp.push("<div class='helper-resize-{0} helper-resize-trigger' data-dir='{0}'></div>".tpl(val));
					});
					if($(this).find(".helper-resize-left").length==0){
						$(this).append(temp.join("")).addClass("help-resize-wrap");
					}
				}
			});
		};
		var trigger={
			flag:false,
			target:null,
			move:{}
		};
		//绝对定位
		var triggerABSHandler={
			top:function ($target,dx,dy) {
					var d1= parseFloat($target.css("top"),10);
					//最小值时候不再变化
					var d2= $target.height();
						$target.height(d2-dy);
					var d3 = $target.height();
					if(d3!=d2){
						$target.css({top:(d1+dy)+"px"})
					}
			},
			bottom:function ($target,dx,dy) {
				var d2= $target.height();
				$target.css({
					height:(d2+dy)+"px"
				})
			},
			left:function ($target,dx,dy) {
				var d1= parseFloat($target.css("left"),10);
				//最小值时候不再变化
				var d2= $target.width();
				$target.width(d2-dx);
				var d3 = $target.width();
				if(d3!=d2){
					$target.css({left:(d1+dx)+"px"})
				}
			},
			right:function ($target,dx,dy) {
				var d2= $target.width();
				$target.css({
					width:(d2+dx)+"px"
				})
			},
			leftTop:function ($target,dx,dy) {
				this.top($target,dx,dy);
				this.left($target,dx,dy);
			},
			rightTop:function ($target,dx,dy) {
				this.top($target,dx,dy);
				this.right($target,dx,dy);
			},
			leftBottom:function ($target,dx,dy) {
				this.bottom($target,dx,dy);
				this.left($target,dx,dy);
			},
			rightBottom:function ($target,dx,dy) {
				this.right($target,dx,dy);
				this.bottom($target,dx,dy);
			}
		};
		//相对定位
		var triggerNORHandler={
			top:function ($target,dx,dy) {
				var top= parseFloat($target.css("margin-top"),10);
				$target.css("margin-top",(top+dy)+"px");
			},
			bottom:function ($target,dx,dy) {

			},
			left:function ($target,dx,dy) {

			},
			right:function ($target,dx,dy) {

			},
			leftTop:function ($target,dx,dy) {

			},
			rightTop:function ($target,dx,dy) {

			},
			leftBottom:function ($target,dx,dy) {

			},
			rightBottom:function ($target,dx,dy) {

			}
		};
		$(document).on("mousedown",".helper-resize-trigger",function (e) {
			trigger.flag = $(this).data("dir");
			trigger.target = $(this);
			trigger.move.x = e.pageX;
			trigger.move.y = e.pageY;
			$.disableSelection();
		}).on("mousemove",function (e) {
			var x=e.pageX-trigger.move.x;
			var y=e.pageY-trigger.move.y;
			if(trigger.flag){

					var $target = trigger.target.parents(".help-resize-wrap");
					if(/absolute|fixed/.test($target.css("position"))){
						if(typeof triggerABSHandler[trigger.flag]=="function"){
							triggerABSHandler[trigger.flag]($target,x,y);
						}
					}else{
						if(typeof triggerNORHandler[trigger.flag]=="function"){
							triggerNORHandler[trigger.flag]($target,x,y);
						}
					}
			}
			trigger.move.x = e.pageX;
			trigger.move.y = e.pageY;
		}).on("mouseup",function () {
			$.enableSelection();
			trigger={
				flag:false,
				target:null,
				move:{}
			};
		});
	}

})();