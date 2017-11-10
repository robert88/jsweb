;
(function () {

	//等比
	function getResize(max, min, cur, maxCur, minCur) {
		return (cur - min) * (maxCur - minCur) / (max - min) + minCur;
	}

	//获取范围
	function getRagen(val, max, min) {
		return (val <= min) ? min : ((val <= max) ? val : max);
	}
	/*
	*refrence,refrenceMax,refrenceMin,setMax,setMin
	*/
	function changeRootrem(obj,callback) {
		var val = getRagen(obj.refrence, obj.refrenceMax, obj.refrenceMin);
		var rem = getResize(obj.refrenceMax, obj.refrenceMin,val, obj.setMax, obj.setMin);
		if(typeof callback=="function"){
			callback(rem)
		}
	}

	function changeRem() {
		changeRootrem({
			refrence:$(window).width(),
			refrenceMax:640,
			refrenceMin:300,
			setMax:125,
			setMin:75,
		},function(rem){
			$("html").css("font-size", rem + "%");
		});
	}
	$(window).on("resize",function () {
		changeRem();
	});
	changeRem()
})();



