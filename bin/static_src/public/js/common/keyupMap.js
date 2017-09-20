;
(function () {
    PAGE.keyupMap = {};
    var $body = $("body");
    $(document).off("keyup.handle").on("keyup.handle",function (e) {
        var ret;
        var doubleKey = [];
        e.altKey && doubleKey.push("alt");
        e.shiftKey && doubleKey.push("shift");
        e.ctrlKey && doubleKey.push("ctrl");
        e.metaKey && doubleKey.push("meta");
        doubleKey.push(e.key);
        doubleKey = doubleKey.join("+");
        var $trigger = $body.find("[key='" + doubleKey + "']");
        if(typeof PAGE.keyupMap[doubleKey] == "function"){
            ret = PAGE.keyupMap[doubleKey](e);
        }
        if($trigger.length){
            $trigger.trigger($trigger.data("key-event"));
            ret =false;
        }
        return ret;
    })
})();



