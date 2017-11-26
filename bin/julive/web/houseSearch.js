$(".search-condition").on("click",">li",function () {
	$(".search-condition>li dl").not($(this)).slideUp();
	$(this).find("dl").slideToggle();
}).on("click","dl .case-type",function () {
	$(this).addClass("current").siblings().removeClass("current");
	$(this).parents("dl").find(".case-type-item").eq($(this).index()).addClass("active").siblings().removeClass("active");
	return false;
}).on("click","dl .case-type-option",function () {
	$(this).parents("dl").slideUp();
	$(this).addClass("selected").siblings().removeClass("selected");
	return false;
}).on("click","dl",function () {
	return false;
});