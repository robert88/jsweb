$(".personList").on("click",".noticeContent-exp",function () {
	$(this).toggleClass("open").parents(".case-list").find(".noticeContent").toggleClass("t-overflow");
	$(this).find(".J-icondown").toggleClass(" icon-chevron-up icon-chevron-down");
	return false;
});