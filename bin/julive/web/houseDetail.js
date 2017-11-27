var swiper = new Swiper('.swiper-container', {
	pagination: '.swiper-pagination',
	onInit: function (swiper){
		var len = swiper.wrapper.find(".swiper-slide").length;
		swiper.wrapper.parent().find(".swiper-slide-info").html('<span class="">' + swiper.activeIndex +"/" +len+ '</span>');
	},
	onSlideChangeEnd:function (swiper) {
		var len = swiper.wrapper.find(".swiper-slide").length;
		swiper.wrapper.parent().find(".swiper-slide-info").html('<span class="">' + swiper.activeIndex +"/" +len+ '</span>');
	},
	paginationClickable: true,
	// Disable preloading of all images
	preloadImages: false,
	// Enable lazy loading
	lazyLoading: true
});
    