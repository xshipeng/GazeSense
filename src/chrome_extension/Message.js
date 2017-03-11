/**
 * Created by kashi on 2016/12/1.
 */
"use strict";

function updataGaze(gazeXData, gazeYData) {
    $("span[id='gazeXid']").html(gazeXData);
    $("span[id='gazeYid']").html(gazeYData);
}

//启动数据传递
function dataStart() {
    var out = self.setInterval("sendScreenXYData()", 500);
    return out;
}

//停止数据传递
function dataEnd(timer1) {
    if (typeof(timer1) !== "undefined")
        clearInterval(timer1);
}

//传送屏幕坐标参数
function sendScreenXYData() {
    sendMessage(20);
}