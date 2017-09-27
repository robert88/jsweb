;
(function () {

	/**
	 * 自定义
	 * radio:.J-label-radio-group->.J-label-box->input
	 * 带动画效果
	 * */

	function checkRadio($parent,$input){
		$parent.find("input").prop("checked",false).trigger("change");
		$parent.find(".J-label-box").removeClass("checked");
		$parent.find(".anim").removeClass("anim-scaleSpring");
		$parent.find(".icon-radiochecked").removeClass("icon-radiochecked").addClass("icon-radio");
		if(!$input.prop("checked")){
			$input.prop("checked",true).trigger("change");
			$input.addClass("checked");
			$input.find(".anim").addClass("anim-scaleSpring ").removeClass("icon-radio").addClass(" icon-radiochecked");
		}
	}
	
	/**
	 * 自定义input
	 * */

	$(document).on("focus","input,select,textarea,.J-input-focus-trigger",function(){

		$(this).parents(".J-input-focus").addClass("focus");

	}).on("blur","input,select,textarea,.J-input-focus-trigger",function(){

		$(this).parents(".J-input-focus").removeClass("focus");
	});


	/**
	 * 自定义
	 * checkbox:.J-checkbox->input
	 *
	 *
	 * */
	$(doucment).off("click",".J-form-radio").on("click",".J-form-radio",function(e){
		var $this = $(this);
		var $checkbox = $this.find("input");
		var $parent = $this.parents(".J-form-radio-group").last();
		if(!$checkbox.prop("checked")){
			$parent.find(".J-form-radio.checked").removeClass("checked");
			$this.addClass("checked");
			$parent.find(".J-form-radio input").each(function () {
					if($(this).prop("checked")){
						$(this).prop("checked",false).val(0).trigger("change");
					}
				});
			$checkbox.prop("checked",true).val(1).trigger("change");
		}
	});

	$(doucment).off("click",".J-form-checkbox").on("click",".J-form-checkbox",function(e){
		var $this = $(this);
		var $checkbox = $this.find("input");
		if($checkbox.prop("checked")){
			$checkbox.prop("checked",false).val(0).trigger("change");
			$this.removeClass("checked")
		}else{
			$checkbox.prop("checked",true).val(1).trigger("change");
			$this.addClass("checked")
		}
	});

	/**
	 * 自定义a标签,假刷新
	 * */
	$(document).on("click","a",function(){
		var $this = $(this);
		var href = ($this.attr("href")||"").split("#")[1];
		if(href&&href==window.location.hash.split("#")[1]){
			PAGE.loading();
			setTimeout(function () {
				PAGE.closeLoading();
			},10);
		}
	});

})();



