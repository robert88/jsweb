

$('.product-wrap .swiper-container').each(function () {
	new Swiper($(this), {
		pagination: '.swiper-pagination',
		slidesPerView: 4,
		nextButton: ".swiper-button-next",
		prevButton: ".swiper-button-prev",
		autoplay:3000,
		paginationClickable: true,
		spaceBetween: 30
	});
});
