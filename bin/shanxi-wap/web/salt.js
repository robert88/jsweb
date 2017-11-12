
;(function () {
	function getHtml(obj){
	 return ['<li class="col6 mt20">',
			'<div class="text-wrap">',
			'<img src="{0}" alt="">',
			'<p class="text">{1}</p>',
		'</div>',
		'</li>'].join("").tpl(obj.img,obj.text);
	}
	var loading;
	$(".loadMore").on("touchstart mousedown",function () {
		if(loading){
			return;
		}
		loading = true;
		$("loading").show();
		$.ajax({
			url:"/api/json",
			success:function (ret) {
				//[{img:"/public/images/salt01.png",text:"螺旋藻碘盐"},{img:"/public/images/salt01.png",text:"螺旋藻碘盐"}];
				if(ret&&ret.data){
					for(var i=0;i<ret.data.length;i++){
						$(".list").append(getHtml(ret.data[i]));
					}
				}

			},complete:function () {
				loading =false;
				$("loading").hide();
			}
		})
	});
})()
