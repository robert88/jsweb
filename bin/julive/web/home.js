
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
