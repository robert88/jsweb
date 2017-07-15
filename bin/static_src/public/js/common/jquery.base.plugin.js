;(function(){
	
	/*转化为数组*/
	if(!$.toArray){
		$.toArray=function(){
			return Object.prototype.toString.call(arr)=="[object Array]"?arr:[arr];
		}
	}

	
/*更新了ui 触发update事件*/
	if(!$.fn.updateUI){
		$.fn.updateUI=function(){
			this.triggerHandler("updateUI");
		}
	}
	
	/*开启选择*/
	if(!$.enableSelection){
		var selection = document.onselectstart;
		$.enableSelection=function(){
			document.onselectstart = selection;
		}
	}
	
	/*取消选择*/
	if(!$.disableSelection){
		$.disableSelection=function(){
			document.onselectstart = function(){return false;}
		}
	}

	/*国际化可以待参数*/
    if(!$.i18n){
        $.i18n=function(code){
            var param;
            if(arguments.length>0){
                param = Array.prototype.slice.call(arguments,1);
            }
        	var lan = window.PAGE.language[window.PAGE.curLanguage];
        	var convertLan ="".tpl.apply( (lan&&lan[code]||code),param);
            return convertLan
        }
    }

    /*延时*/
    if(!$.delay){
    	$.delay = (function(){
    			var timer;
    			return function(time,callBack){
    				clearTimeout(timer);
                    timer = setTimeout(function(){
    					if(typeof callBack == "function"){
    						callBack()
    					}
    				},time)
    			}
    		})();
    }
    if(!$.fn.innerHeight){
		$.fn.innerHeight = function(){
			return this.height()+(this.css("padding-top")||"").toFloat()+(this.css("padding-bottom")||"").toFloat()
		}
	}
	if(!$.fn.innerWidth){
		$.fn.innerWidth = function(){
			return this.width()+(this.css("padding-left")||"").toFloat()+(this.css("padding-right")||"").toFloat()
		}
	}
	if(!$.fn.changeSize){
		$.fn.changeSize = function(type){
			
			return this.width()+(this.css("padding-left")||"").toFloat()+(this.css("padding-right")||"").toFloat()
		}
	}

})();