var demoimg = new Image();
demoimg.onload = function () {

	var canvasObj = getCanvas(demoimg.width, demoimg.height);
	var ctx = canvasObj.ctx;
	//画原始图
	ctx.drawImage(demoimg, 0, 0, demoimg.width, demoimg.height, 0, 0, demoimg.width, demoimg.height);
	var imgdata = ctx.getImageData(0, 0, demoimg.width, demoimg.height);

	//获取直方图数据
	var histogramData = getHistogramData(imgdata);

	//动画的方式画出每个阈值下的效果
	var canvasObj2 = getCanvas(demoimg.width, demoimg.height);
	var canvasObj5 = getCanvas(demoimg.width, demoimg.height);
	scanThreshold(imgdata, canvasObj2,canvasObj5, histogramData);

	//画完整的直方图
	var canvasObj3 = getCanvas(demoimg.width, demoimg.height);
	drawHistogram(canvasObj3.ctx, histogramData, 256);

	//画最佳阈值二值图图
	var canvasObj4 = getCanvas(demoimg.width, demoimg.height);
	drawPeakAndBetterPeakImage(canvasObj3.ctx,canvasObj4.ctx, histogramData, imgdata);

}
demoimg.src = "public/images/handle/lena.jpg";


/**
 * 获取灰度值
 * */
function getGray(R,G,B){

	//1避免低速的浮点运算
	//var Gray = R*0.299 + G*0.587 + B*0.114
	//32位运算
	//var gray = (R*299 + G*587 + B*114 + 500) / 1000;//灰度计算公式
	//var gray = (R*30 + G*59 + B*11 + 50) / 100;
	//8位精度的移位算法
	var gray = (R*38 + G*75 + B*15) >> 7
	//2位精度的移位算法
	//var gray=(R*1 + G*2 + B*1) >> 2  //-》Gray = (R + G<<1 + B) >> 2
	//Adobe Photoshop算法
	//var gray = Math.pow((Math.pow(R,2.2) * 0.2973 + Math.pow(G,2.2)  * 0.6274 + Math.pow(B,2.2)  * 0.0753),1/2.2);
	//平均法
	//var gray =(R+G+B)/3;

	return Math.floor(gray);
}


/*
 *获取灰度直方图数据
 */
function getHistogramData(imgdata) {
	var data = imgdata.data;
	var drawStack = [];
	var countArr = [];
	var max=0;
	//数据量很大不允许有出栈和入栈，否则chrome会卡死
	for (var i = 0; i < data.length; i+=4) {
		var R = data[i];
		var G = data[i + 1];
		var B = data[i + 2];
		var gray = Math.floor((R+G+B)/3);//getGray(R,G,B);
		var count = countArr[gray] = (countArr[gray] || 0) +1;
		max = max < count ? count : max;
	}

	drawStack.push({name: "beginPath"});
	var y =( countArr[0] / max * 500 )||0
	drawStack.push({name: "moveTo", arg: [0, y]});
	for (var j = 1; j < 256; j++) {
		y =( countArr[j] / max * 500 )||0
		drawStack.push({name: "lineTo", arg: [j, y], gray: j});
	}
	drawStack.push({name: "stroke"});

	return {max:max,drawStack:drawStack,countArr:countArr};
}

/*
*画灰度直方图
 */
function drawHistogram(ctx,histogramData,  threshold) {
	var drawStack = histogramData.drawStack;
	for (var i = 0; i < drawStack.length; i++) {
		//按照
		if (drawStack[i].gray && drawStack[i].gray > threshold) {
			continue;
		}
		ctx[drawStack[i].name].apply(ctx, drawStack[i].arg || [])
	}
}
function scanThreshold(imgdata, canvasObj,canvasObj2, histogramData) {
	canvasObj.threshold = canvasObj.threshold || 0;
	canvasObj.threshold += 2;
	var threshold = canvasObj.threshold;
	if (threshold >= 255) {
		drawPeakAndBetterPeakImage(canvasObj2.ctx,canvasObj.ctx, histogramData, imgdata);
		return;
	}
	//画灰度直方图
	drawHistogram( canvasObj2.ctx, histogramData, threshold);
	//画二值图
	drawBinaryImage(canvasObj.ctx, getBinaryImageData(imgdata,threshold), threshold);

	setTimeout(function () {
		scanThreshold(imgdata, canvasObj,canvasObj2, histogramData);
	}, 1000)
}

/*
*通过阈值得到二值图像数据
* */
function getBinaryImageData(imgdata,threshold){
	var width= imgdata.width;
	var height=imgdata.height;
	var data = imgdata.data;
	var newImageData = new ImageData(width, height);
	for (var i = 0; i < data.length; i+=4) {
		var R = data[i];
		var G = data[i + 1];
		var B = data[i + 2];
		newImageData.data[i + 3]=data[i + 3];
		var gray = Math.floor((R+G+B)/3);//getGray(R,G,B)

		gray = gray > threshold ? 255 : 0;

		newImageData.data[i] = newImageData.data[i + 1] = newImageData.data[i + 2] = gray
		
	}
	return newImageData;
}


/*
 *画二进制图
 * */
function drawBinaryImage(ctx, binaryImageData, threshold) {
	ctx.beginPath();
	ctx.putImageData(binaryImageData, 0, 0);
	ctx.clearRect(0, 0, 60, 30);
	ctx.font = "20px arial";
	ctx.fillText("T:" + threshold, 0, 20);
}
/*
 * 创建一个canvas
 * */
function getCanvas(width, height) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	$("#testwrap").append(canvas);
	var ctx = canvas.getContext("2d");
	return {canvas: canvas, ctx: ctx}
}
/*
 * 获取拐点的坐标
 * */
function getOriginPeakData(histogramData) {
	var countArr = histogramData.countArr;

	var peakData = [];
	var helpInfo = {};
	for (var i = 1; i < 256; i++) {
		checkPeak(helpInfo, countArr[i - 1], countArr[i], function (type,currValue,frontValue) {
			peakData.push({type: type > 0 ? "up" : "down", idx: i - 1,count:frontValue});
		});
	}
	return peakData;
}
/*
 * 获取双峰之间的顶点数据信息
 * */
function getPeakData(histogramData){

	var max = histogramData.max;

	var peakData = getOriginPeakData(histogramData);

	//误差为10
	var newPeakData = filterPeakData(peakData, max, 10);
	
	//得到双峰之间的数据
	newPeakData = filterByDoubleMaxPeak(newPeakData);

	return newPeakData;
}
/*
* 画直方图和最佳阈值二值图
* */
function drawPeakAndBetterPeakImage(histogramCtx, ctx, histogramData, imgdata){

	var max = histogramData.max;

	var peakData = getPeakData(histogramData);

	drawPeak(peakData, max, histogramCtx);

	var T = getbetterT(peakData);
	if(!isNaN(T)){
		drawBinaryImage(ctx, getBinaryImageData(imgdata,T), T);
	}

}

/*
* 画双峰图
* */
function drawPeak(peakData,max, ctx) {

	ctx.beginPath();
	for (var j = 0; j < peakData.length; j++) {
		var y = peakData[j].count / max * 500;
		ctx.arc(peakData[j].idx, y, 2, 0, Math.PI * 2);
		ctx.closePath();
	}
	ctx.fillStyle = "red";
	ctx.fill();

}

/*
* 两个峰之间的落差要求大于difference
* */
function filterPeakData(peakData, max,difference) {

	for (j = 1; j < peakData.length; j++) {
		var y1 = peakData[j].count / max * 500;
		var y2 = peakData[j-1].count / max * 500;
		if (Math.abs(y1 - y2) < difference) {
			peakData[j] = peakData[j - 1]
		}
	}
	var newPeakData = [];
	var helpInfo = {};
	for (var j = 1; j < peakData.length; j++) {
		checkPeak(helpInfo, peakData[j-1].count, peakData[j].count, function (type,currValue,frontValue) {
			newPeakData.push(peakData[j-1]);
		});
	}

	return newPeakData;
}
/*
 * 取双峰之间的顶点（包括双峰）
 * */
function filterByDoubleMaxPeak(peakData) {
	var two = [{}, {}];
	var newpeak = [];
	for (var j = 1; j < peakData.length; j++) {
		var y = peakData[j].count;
		if (!(two[0].value > y)) {
			two[0] = {value: y, idx: j};
		} else if (!(two[1].value > y)) {
			two[1] = {value: y, idx: j};
		}
	}
	var start = Math.min(two[0].idx, two[1].idx);
	var end = Math.max(two[0].idx, two[1].idx);
	for (var i = start; i <= end; i++) {
		newpeak.push(peakData[i])
	}
	return newpeak;
}
/*
 * 判断是否是拐点，是拐点就callback
 * */
function checkPeak(helpInfo, frontValue, currValue, callback) {

	var changeValue = frontValue - currValue;
	if (changeValue == 0) {
		return;
	}
	var changeType = changeValue > 0 ? 1 : -1;
	var prevValue = helpInfo.prevValue;

	if (typeof prevValue != "undefined" && prevValue != changeType) {
		callback(changeType,currValue,frontValue);
	}
	helpInfo.prevValue = changeType;
}

/*
* 取双峰之间波谷平均值
* */
function getbetterT(peakData) {
	if (peakData.length < 3) {
		console.error("not enough data")
	}
	var count = 0, num = 0;
	for (var i = 1; i < peakData.length - 1; i++) {
		if (peakData[i].type == "down") {
			count += peakData[i].idx;
			num++;
		}
	}
	return count / num;
}
