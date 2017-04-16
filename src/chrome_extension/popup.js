"use strict";
var str1, str2;
//得到从后台运行的 js 文件里的东西，即 socket.js
var bgScript = chrome.extension.getBackgroundPage();
//让变量存在后台，启动时检查变量来给页面赋值
var isStart = bgScript.isStart;
str1 = "Start";
str2 = "Stop";
var m_switch = $('#start');
//js 文件加载时就启动
changeState();

//启动&停止
function Button1() {
    if (m_switch.val() == str1) {
        bgScript.websocketInit(); //启动
        m_switch.val(str2);
        bgScript.setStatus(true);
    } else {
        bgScript.websocketShutdown(); //停止
        m_switch.val(str1);
        bgScript.setStatus(false);
    }
}

//图片输出
function Button2() {
    chrome.tabs.insertCSS(null, {file: "drawing.css"});
    chrome.tabs.executeScript({
        file: "heatmap.min.js"
    });
    chrome.tabs.executeScript({
        file: "jquery-3.1.1.min.js"
    });
    // chrome.tabs.executeScript({
    //   file: "html2canvas.js"
    // });
    var nArray = bgScript.dataArray;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "FROM_BACKGROUND", text: nArray});
    });
}


//判断状态的方法
function changeState() {
    if (!isStart) {
        m_switch.val(str1);
    } else {
        m_switch.val(str2);
    }
}


//detect the user input
$(document).ready(function () {
    $("#showGaze").click(function () {
        if ($("#showGaze").prop("checked") == true) {
            bgScript.sendMessage("showGaze_on");
        }
        else {
            bgScript.sendMessage("showGaze_off");
        }
    })
    $("#showImage").click(function () {
        if ($("#showImage").prop("checked") == true) {
            bgScript.sendMessage("showImage_on");
        }
        else {
            bgScript.sendMessage("showImage_off");
        }
    })
    $("#controlPage").click(function () {
        if ($("#controlPage").prop("checked") == true) {
            bgScript.sendMessage("controlPage_on");
        }
        else {
            bgScript.sendMessage("controlPage_off");
        }
    })
    var listBox;
    listBox = $('#start');
    listBox.on('click', function () {
        Button1();
    });
    listBox = $('#generate');
    listBox.on('click', function () {
        Button2();
    });
});

//save the canvas to image
function saveImage(canvas) {
    var image = canvas.toDataURL("image/png");
    window.open(image);
}