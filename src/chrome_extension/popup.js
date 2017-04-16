"use strict";
var str1, str2;
//得到从后台运行的 js 文件里的东西，即 background.js
var bgScript = chrome.extension.getBackgroundPage();
//让变量存在后台，启动时检查变量来给页面赋值
var isStart = bgScript.isStart;
var isShowGaze = bgScript.isShowGaze;
var isShowImage = bgScript.isShowImage;
var isControlPage = bgScript.isControlPage;
str1 = "Start";
str2 = "Stop";
var m_switch = $('#start');
var showGaze = $('#showGaze');
var showImage = $('#showImage');
var controlPage = $('#controlPage');
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

//判断状态的方法
function changeState() {
  if (!isStart) {
    m_switch.val(str1);
  } else {
    m_switch.val(str2);
  }
  if(isShowGaze){
    showGaze.prop("checked",true);
  } else{
    showGaze.prop("undefined",false);
  }
  if(isShowImage){
    showImage.prop("checked",true);
  } else{
    showImage.prop("undefined",false);
  }
  if(isControlPage){
    controlPage.prop("checked",true);
  } else{
    controlPage.prop("undefined",false);
  }
}

//图片输出
function Button2() {
  handlePage();
}
//detect the user input
$(document).ready(function () {
  showGaze.change(function () {
        if(showGaze.is(':checked')){
          bgScript.setGazeStatus(true);
          bgScript.sendMessage("showGaze:on");
        }else{
          bgScript.setGazeStatus(false);
           bgScript.sendMessage("showGaze:off");
        }
    });
     showImage.change(function () {
        if(showImage.is(':checked')){
          bgScript.setImageStatus(true);
          bgScript.sendMessage("showImage:on");
        }else{
          bgScript.setImageStatus(false);
          bgScript.sendMessage("showImage:off");
        }
    });
     controlPage.change(function () {
        if(controlPage.is(':checked')){
          bgScript.setControlStatus(true);
          bgScript.sendMessage("controlPage:on");
        }else{
          bgScript.setControlStatus(false);
          bgScript.sendMessage("controlPage:off");
        }
    });
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

function handlePage() {
  chrome.tabs.insertCSS(null, { file: "drawing.css" });
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
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "FROM_BACKGROUND", text: nArray });
  });
}
//save the canvas to image
function saveImage(canvas) {
  var image = canvas.toDataURL("image/png");
  window.open(image);
}