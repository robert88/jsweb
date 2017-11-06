
$('.bannar-carousel .swiper-container').each(function () {
	new Swiper($(this), {
		autoplay:3000,
		speed: 1000,
		pagination: '.swiper-pagination',
		paginationBulletRender: function (swiper, index, className) {
			return '<span class="' + className + '"></span>';
		},
		paginationClickable:true
	});
});

$('.product-wrap .swiper-container').each(function () {
	new Swiper($(this), {
		pagination: '.swiper-pagination',
		slidesPerView: 4,
		autoplay:3000,
		paginationClickable: true,
		spaceBetween: 30
	});
});

