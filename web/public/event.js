var ws = new WebSocket("ws://" + location.host);

function connectToServer() {
    try {
        console.log("Connecting to Websocket...")
        ws = new WebSocket("ws://" + location.host);
        ws.onerror = (err) => {
            console.error(err);

            console.warn("Connection Closed. Try again in 5 second.")
            setTimeout(connectToServer, 5000);

        };

    } catch (e) {

    }


}
var accountConfig = null;
var globleConfig = null;
//开启连接open后客户端处理方法
ws.onopen = function () {
    // Web Socket 已连接上，在页面中显示消息
    document.getElementById('res').innerHTML = "当前客户端已经连接到websocket服务器";

};
// 点击按钮时给websocket服务器端发送消息
$('#btn').click(function () {
    var value = $('#demo').val();
    ws.send(value);
})
// 接收消息后客户端处理方法
ws.onmessage = function (evt) {
    console.log(evt.data);
    var data = evt.data;
    try {
        data = JSON.parse(data);
        // console.log(data);
        document.getElementById('res').innerText += "\n" + (data.msg.line);
    } catch (e) {
        data = evt.data;
        document.getElementById('res').innerText += "\n" + (data);

    }
};

// 关闭websocket
ws.onclose = function () {
    // 关闭 websocket
    // alert("连接已关闭...");
    console.warn("Connection Closed. Try again in 5 second.")
    setTimeout(connectToServer, 5000);

};