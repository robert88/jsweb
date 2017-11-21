$(".personList").on("click",".noticeContent-exp",function () {
	$(this).toggleClass("open").parents(".case-list").find(".noticeContent").toggleClass("t-overflow");
	return false;
});