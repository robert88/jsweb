function AutoScroll(t) {
	var h = $(t).find("li").height();
	if($(t).find("li").length<=1){
		return;
	}
	$(t).find("ul:first").animate({
		marginTop: "-"+h+"px"
	}, 3000, function() {
		$(this).css({
			marginTop: "0"
		}).find("li:first").appendTo(this),
			setTimeout('AutoScroll(".scrollDiv")', 3000)
	})
}

$(".open").click(function () {
	var $item = $(this).parents(".find-item");
	var ulHeight = $item.find("ul").height();
	var liHeight = $item.find("ul>li").height();
	if($item.hasClass("find-item-open")){
		$item.removeClass("find-item-open").height(liHeight);
	}else{
		$item.addClass("find-item-open").height(ulHeight);
	}
});

AutoScroll(".scrollDiv");