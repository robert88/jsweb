//文件操作
var wake = require("../rap.filesystem.js");
require("../rap.util.prototype.js")

var files = wake.findFile("../senlin/public/images/propsItem","png")
console.log(files)
var count =0;
files.forEach(function(val){
	count++;
	wake.copy(val,val.replace(/\/(\w+\.png)/g,function(m,m1){return "/"+m1.replace(/^\d+/,(count+"").fill("000"))}))
})