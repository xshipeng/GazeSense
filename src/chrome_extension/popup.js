"use strict";
var str1, str2;
//得到从后台运行的 js 文件里的东西，即 socket.js
var bgscrpt = chrome.extension.getBackgroundPage();
//让变量存在后台，启动时检查变量来给页面赋值
var isStart = bgscrpt.isStart;
str1 = "Start";
str2 = "Stop";
var m_switch = $('#start');
//js 文件加载时就启动
changeState();

//启动&停止
function Button1() {

  if (m_switch.val() == str1) {
    //调用 sokcet.js的方法
    bgscrpt.websocketInit(); //启动
    m_switch.val(str2);
    bgscrpt.setStatus(true);
  } else {
    bgscrpt.websocketShutdown(); //停止
    m_switch.val(str1);
    bgscrpt.setStatus(false);
  }
}

//判断状态的方法
function changeState() {
  if (!isStart) {
    m_switch.val(str1);
  } else {
    m_switch.val(str2);
  }
}

//图片输出
function Button2() {
  handlePage();
}

$(document).ready(function () {
  var listbox;
  listbox = $('#start');
  listbox.on('click', function () {
    Button1();
  });
  listbox = $('#generate');
  listbox.on('click', function () {
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
  var nArray = bgscrpt.dataArray;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "FROM_BACKGROUND", text: nArray });
  });
}
//save the canvas to image
function saveImage(canvas) {
  var image = canvas.toDataURL("image/png");
  window.open(image);
}