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
            var pArray = processData(nArray);
            console.log(pArray); //
            console.log("drawingdata...");
            drawing(pArray);
            // saveImage();
        }
    });
console.log("insert,success!");

function drawing(nArray) {
    var datacanvas = document.createElement("div");
    datacanvas.width = $(document).Width;
    datacanvas.height = $(document).Height;
    var body = document.querySelector("body");
    body.appendChild(datacanvas);
    datacanvas.setAttribute("id", "NOTEPAD");//需要通过popup/background.js 中注入css
    var config = {
        container: body,
        radius: 100,
        maxOpacity: .5,
        minOpacity: 0,
        blur: .75
    };
    var heatmapInstance = h337.create(config);
    heatmapInstance.addData(nArray);
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
    var pArray = [];
    var tabheight = screen.height - window.innerHeight;
    for (var arr of nArray) {
        arr[1] = arr[1] + arr[2] - tabheight;//dealing with the scroll data
        arr[2] = 300;//delete the scroll data
        object = array2object(arr);//transform the array into object
        pArray.push(object);
    }
    return pArray;
}

function array2object(arr) {
    var object = { x: 0, y: 0, value: 0 };
    object.x = arr[0];
    object.y = arr[1];
    object.value = arr[2];
    console.log("2object_success");
    return object;
}

