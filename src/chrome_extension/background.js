// "use strict";

var ws;
//var timer1;
var START_FLAG = 0;
var isStart = false;
var dataArray = [];
var scrollHeight = 0;
function websocketInit() {
  ws = new WebSocket("ws://localhost:8181");
  ws.binaryType = "arraybuffer";//set the type of received data:array, teh default type is bolb
  ws.onopen = function (event) {
    chrome.tabs.executeScript({
      file: 'jquery-3.1.1.min.js'
    });
    dataArray = [];// clear the array stored gaze data
    sendMessage("start");
    //timer1=dataStart();
    START_FLAG = 1;
  };

  ws.onmessage = function (event) {
    if (event.data instanceof ArrayBuffer) {

      chrome.tabs.executeScript({
        code: 'window.postMessage({type: "FROM_CURRENTPAGE",text: $(document).scrollTop()},"*");'
      });
      var rArray = new Int32Array(event.data); //Int32Array cannot be changed if created
      var aDataArray = [];
      aDataArray.push(rArray[0]);
      aDataArray.push(rArray[1]);
      aDataArray.push(scrollHeight);
      dataArray.push(aDataArray);
      console.log("Received Array:" + aDataArray);
    }
    else console.log("Receive:" + event.data);
  }

  ws.onclose = function (event) {
    console.log("Connection Stopped");
    START_FLAG = 0;
  }
}

function websocketShutdown() {
  sendMessage("stop");
  ws.close();
}

function websocketContinue() {
  if (START_FLAG !== 1)
    return;
  sendMessage("continue");
  //timer1=dataStart(timer1);
}
//query information from the server
function websocketQuery() {
  if (START_FLAG !== 1)
    return;
  sendMessage("query");
}
function websocketSuspend() {
  if (START_FLAG !== 1)
    return;
  sendMessage("suspend");
  //dataEnd(timer1);
}

//websocket发送消息
function sendMessage(data) {
  console.log("Send:" + data);
  ws.send(data);
}

//设置状态，在 pop.js 运行
function setStatus(state) {
  isStart = state;
}

/*chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    console.log('holla');
    chrome.tabs.captureVisibleTab(
        null,
       {"format":"png"},
       function(dataUrl)
        {
            sendResponse({imgSrc:dataUrl});
            chrome.tabs.create({
    url:dataUrl,
    active:true
});
        }
    ); //remember that captureVisibleTab() is a statement
    return true;
});*/

// window.addEventListener("load", websocketInit, false);
setInterval(function () { websocketQuery(); }, 100);

/*var s = document.createElement('script');
s.src = chrome.extension.getURL('html2canvas.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
  s.parentNode.removeChild(s);
};*/
chrome.runtime.onMessage.addListener(
  function (data, sender, sendResponse) {
    console.log("ScrollHeight:" + data);
    scrollHeight = data;
  });