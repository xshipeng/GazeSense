window.addEventListener("message", function (event) {
    if (event.data.type == "FROM_CURRENTPAGE") {
        console.log(event.data.text);
        chrome.runtime.sendMessage(event.data.text);
    }
}, false);
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == "FROM_BACKGROUND") {
            console.log("processingdata...");
            var nArray = request.text;
            processData(nArray);
            console.log("drawingdata...");
            drawing(nArray);
            // saveImage();
        }
    });
function drawing(nArray) {
    var datacanvas = document.createElement("canvas");
    datacanvas.width = window.innerWidth;
    datacanvas.height = window.innerHeight;
    var body = document.querySelector("body");
    body.appendChild(datacanvas);
    datacanvas.setAttribute("id", "NOTEPAD");//需要通过popup/background.js 中注入css
    var hm = new HeatMap(datacanvas, datacanvas.width, datacanvas.height);
    hm.addData(nArray);
    hm.render();
}
//保存图片
// function saveImage() {
//     console.log("savingimage....");
//     html2canvas(document.body).then(function (canvas) {
//         var image = canvas.toDataURL("image/png");
//         window.open(image);
//     });
// }

function processData(nArray) {
    var tabheight = screen.height - window.innerHeight;
    for (var arr of nArray) {
        arr[1] = arr[1] + arr[2] - tabheight;//dealing with the scroll data
        arr.pop();//delete the scroll data
    }
}



