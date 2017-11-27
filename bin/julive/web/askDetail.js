
function closeDialog() {
	$(".ask-mask").hide();
	$(".ask-dialog").hide()
}

$(".J-ask-btn").click(function () {
	$(".ask-mask").show();
	var winH = $(window).height();
	var H = $(".ask-dialog").height();
	var setH = H>winH?0:(winH-H)/2;
	$(".ask-dialog").show().css({top:setH});
});

$(".ask-mask").click(function () {
	closeDialog();
});
$(".ask-dialog").find("input[name='phone']").keyup(function () {
	if($(this).val()){
		$(".ask-dialog").find(".btn").removeClass("disabled")
	}else{
		$(".ask-dialog").find(".btn").addClass("disabled")
	}
});