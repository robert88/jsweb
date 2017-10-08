//npm install gulp gulp-sass gulp-imagemin gulp.spritesmith --save
var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

var list = [
	"./animateItem/banquetfiy/*.png",
	"./animateItem/copper-boom/*.png",
	"./animateItem/copper-down/*.png",
	"./animateItem/copper-fly/*.png",
	"./animateItem/copper-stack/*.png",
	"./animateItem/fundMoney/*.png",
	"./animateItem/gold/*.png",
	"./animateItem/throwMoney/*.png",

	"./daojuItem/*.png",
	"./formItem/*.png",
	"./iconItem/*.png",
	"./renItem/*.png",
	"./textItem/*.png"
]
var listName = [
	"banquetfiy",
	"copper-boom",
	"copper-down",
	"copper-fly",
	"copper-stack",
	"fundMoney",
	"gold",
	"throwMoney",

	"daojuItem",
	"formItem",
	"iconItem",
	"renItem",
	"textItem"
];
var tasklist= [];
for (var i = 0; i < list.length; i++) {
	;(function(i){
		gulp.task('default' + i, function () {
		var spriteData = gulp.src(list[i]).pipe(spritesmith({
			imgName: listName[i] + '.png',
			cssName: listName[i] + '.css',

			padding:10
		}));
		return spriteData.pipe(gulp.dest('./'));
	});
	tasklist.push('default' + i);
	}(i));
}
gulp.task('default', tasklist);