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

AutoScroll(".scrollDiv");