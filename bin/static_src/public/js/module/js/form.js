/**
 * Created by 84135 on 2017/5/23.
 */
/*自定义input 的focus*/
;(function bindInput(){

	$(document).on("focus","input,select,textarea,.J-input-focus-trigger",function(){

		$(this).parents(".J-input-focus").addClass("focus");

	}).on("blur","input,select,textarea,.J-input-focus-trigger",function(){

		$(this).parents(".J-input-focus").removeClass("focus");
	})
}).call();

/*自定义checkbox和radio*/
;(function bindCheckbox(){

	$(document).on("click",".J-label-box",function(){

		var $this  = $(this);

		var $checkbox = $this.find("input");

		var $radioGroup = $this.parents(".J-label-radio-group");

		//radio
		if($radioGroup.length){
			$radioGroup.find("input").prop("checked",false).trigger("change");
			$radioGroup.find(".J-label-box").removeClass("checked");
			$radioGroup.find(".anim").removeClass("anim-scaleSpring");
			$radioGroup.find(".icon-radiochecked").removeClass("icon-radiochecked").addClass("icon-radio");
			if(!$checkbox.prop("checked")){
				$checkbox.prop("checked",true).trigger("change");
				$this.addClass("checked");
				$this.find(".anim").addClass("anim-scaleSpring ").removeClass("icon-radio").addClass(" icon-radiochecked");
			}
			//checkbox
		}else{
			if($checkbox.prop("checked")){
				$checkbox.prop("checked",false).val(0).trigger("change");
				$this.removeClass("checked")
			}else{
				$checkbox.prop("checked",true).val(1).trigger("change");
				$this.addClass("checked")
			}
		}
	})

}).call();