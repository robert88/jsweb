;(function () {
	var $content = $(".goldHouse");
	$content.find(".tab-head-item").each(function () {
		var handle = $(this).data("handle");
		if(handle){
			this[handle] = function ($bodyItem,$this) {
				alert(0)
			}
		}

	});

})();