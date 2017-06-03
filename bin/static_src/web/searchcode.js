$(".submit").click(function () {
	var val=$("#test").val();
	if(val){
		$.ajax({url:"/ajax/index/getCode",
			data:val,
			success:function (ret) {
			console.log(ret)
		},error:function (e) {
			console.log(e)
		}})
	}
});
$.ajax({url:"/ajax/index/getCode",success:function (ret) {
	console.log(ret);
},error:function (ret) {
	console.error(ret)
}})