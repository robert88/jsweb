
$("body").find(".J-submitBtn").removeClass("J-submitFocus");
$dialog.find(".J-submitBtn").addClass("J-submitFocus");
var validForm = PAGE.validForm({
	validSuccess:function ($form) {
		debugger
		PAGE.ajax({
			data:$form.serialize(),
			url:"/ajax/index/getCode",
			success:function (ret) {
				$.tips("suceess");
			}
		})
	},
	form:$dialog.find("form")
});
var validRule = validForm("getRule");
validRule["checkFile"] = {
	check:function(value, $obj) {

		//传递了比较值
		var acceptTypes = $obj.data("accept-file").split(",");
		var pointIndex = value.lastIndexOf(".")+1;
		if(!pointIndex){
			return true;
		}
		var ret = true;
		var type = value.slice(pointIndex);
		$.each(acceptTypes,function (idx,acceptType) {
			acceptType = acceptType.trim();
			if(acceptType==type){
				ret = false;
			}
		});
		return ret;
	},
	defaultMsg:"i18n.invalid.file.type"

}
$dialog.css({"max-height":"500px","min-width":"570px","min-height":"180px"});