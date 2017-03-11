/*var canvas = document.createElement("canvas");
//canvas.width = div.clientWidth;
//canvas.height = 1920;
var body = document.querySelector("body");
body.appendChild(canvas);
canvas.setAttribute("id", "NOTEPAD");//需要在popup/background.js 中注入css
chrome.runtime.sendMessage({msg: "capture"}, function(response) {
 console.log(response.imgSrc);
});//CaptureActiveTab 功能要求必须在background中运行，想background.js中发送信息在其中截图*/

// function drawCircle(x, y, canvas) {
//   var cxt = canvas.getContext("2d");
//   cxt.fillStyle = "rgba(255,0,0,0.3)"; //30%的透明度
//   cxt.beginPath();
//   //context.arc(x,y,r,sAngle,eAngle,counterclockwise);
//   //x 圆的中心的 x 坐标。
//   //y 圆的中心的 y 坐标。
//   //r 圆的半径。
//   //sAngle  起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
//   //eAngle  结束角，以弧度计。
//   //counterclockwise  可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。
//   cxt.arc(x, y, 30, 0, Math.PI * 2, true);
//   cxt.closePath();
//   //cxt.fill();
//   cxt.stroke();
// }
