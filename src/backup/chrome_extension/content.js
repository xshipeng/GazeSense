
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

            var nArray = [];
            var pArray = [];

            nArray=request.text;
            // console.log(nArray);
            for (var arr of nArray) {
                console.log("N",arr[0],arr[1],arr[2]);
            }

            var pArray = processData(nArray);
            // console.log(pArray);
            for (var arr of pArray) {
                console.log("P",arr.x,arr.y,arr.value,arr.screenwidth,arr.tabheight,arr.documentwidth);
            }

            console.log("drawingdata...");
            drawing(pArray);
           // drawing([{x:1000,y:300,value:300},{x:1500,y:500,value:100}]);
            // saveImage();
        }
    });


function drawing(pArray) {
    var datacanvas = document.createElement("div");
    datacanvas.width = $(document).Width;
    datacanvas.height = $(document).Height;
    var body = document.querySelector("body");
    body.appendChild(datacanvas);
    datacanvas.setAttribute("id", "NOTEPAD");//需要通过popup/background.js 中注入css
    var config = {
        container: body,
        radius: 75,
        maxOpacity: .5,
        minOpacity: 0,
        blur: .75
    };
    var heatmapInstance = h337.create(config);
    heatmapInstance.addData(pArray);
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
    var screenwidth = screen.width; //acquire the width of the screen
    var tabheight = screen.height - window.innerHeight;
    var documentwidth = document.body.clientWidth; //acquire the width of the page
    for (var arr of nArray) {
        arr[0] = arr[0] / screenwidth * documentwidth;//process the width to adapt page zoom
        arr[1] = arr[1] + arr[2] - tabheight;//dealing with the scroll data
        arr[2] = 300;//set the default value for the heatmap drawing
        object = array2object(arr,screenwidth,tabheight,documentwidth);//transform the array into object
        pArray.push(object);
    }
    return pArray;
}

function array2object(arr,screenwidth,tabheight,documentwidth) {
    var object = { x: 0, y: 0, value: 0, screenwidth: 0 , tabheight: 0 , documentwidth: 0  };
    object.x = arr[0];
    object.y = arr[1];
    object.value = arr[2];
    object.screenwidth = screenwidth;
    object.tabheight = tabheight;
    object.documentwidth = documentwidth;
    console.log("2object_success");
    return object;
}
console.log("insert,success!");

