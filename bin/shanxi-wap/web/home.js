;(function () {
    $(window).on("resize",function () {
        resizeHeight();
    });
    function getResize(max, min, cur, maxCur, minCur) {
        return (cur - min) * (maxCur - minCur) / (max - min) + minCur;
    }

    //获取范围
    function getRagen(val, max, min) {
        return (val <= min) ? min : ((val <= max) ? val : max);
    }

    function resizeHeight() {
        var w = getRagen($(window).width(), 640, 300);
        $(".homebg").height(getResize(640, 300, w, 1136, 1136*300/640));
    }
    resizeHeight();
}());

