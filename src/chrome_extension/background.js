var ws;
var START_FLAG = 0;
var isStart = false;
var dataArray = [];
var scrollHeight = 0;
function websocketInit() {
  ws = new WebSocket("ws://localhost:8181");
  ws.binaryType = "arraybuffer";//set the type of received data:array, the default type is bolb
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
//query information from the server
function websocketQuery() {
  if (START_FLAG !== 1)
    return;
  sendMessage("query");
}
//send message to server
function sendMessage(data) {
  console.log("Send:" + data);
  ws.send(data);
}

//设置状态，在 pop.js 运行
function setStatus(state) {
  isStart = state;
}

setInterval(function () { websocketQuery(); }, 100);

chrome.runtime.onMessage.addListener(
  function (data, sender, sendResponse) {
    //console.log("ScrollHeight:" + data);
    scrollHeight = data;
  });//receive the scrollheight from content.js