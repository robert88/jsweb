;
(function () {


	/*tab*/
	$(document).on("click",".tab-wrap>.tab-head>.tab-head-item",function(){

		var $this = $(this);
		var handle = $this.data("handle");

		//取消切换
		if($this.hasClass("disabled") && $this.hasClass("active") ){
			return false;
		}

		var $parent = $this.parents(".tab-wrap");
		var curIndex = $this.index();
		var $allHeadItem  = $parent.find(".tab-head-item");
		var $allBodyItem = $parent.find(".tab-body-item");
		var $body =  $parent.find(".tab-body");
		var bodyItemStr = $body[0].nodeName == "UL"?("<li class='tab-body-item'></li>"):("<div class='tab-body-item'></div>");


		//不存在目标
		if( $allBodyItem.eq(curIndex).length == 0 ){
			var time = $allHeadItem.length -  $allBodyItem.length;
			if(time>0){
				for(var i=0;i<time;i++){
					$body.append(bodyItemStr);
				}
				$allBodyItem = $parent.find(".tab-body-item");
			}
		}
		//隐式函数
		if(typeof $this[0][handle] =="function"){
			//利用函数的返回值添加功能
			if($this[0][handle]($allBodyItem.eq(curIndex),$this) === false){
				return
			}
		}

		$allHeadItem.removeClass("active");
		$allBodyItem.removeClass("active");
		$this.addClass("active");
		$allBodyItem.eq(curIndex).addClass("active");
		return false;
	});




})();



