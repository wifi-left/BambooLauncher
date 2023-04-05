const fs = require('fs');
const os = require('os');

const controller = new AbortController();
const { signal } = controller;

var globleConfig = null;
var accountConfig = null;
var websocket = null;

const iconv = require("iconv-lite");
const shellspawn = require("child_process").spawn;

var encoding = 'utf8';
switch (os.platform()) {
    // ’darwin’, ‘freebsd’, ‘linux’, ‘sunos’ , ‘win32’
    case 'darwin':
    // Apple
    case 'linux':
    case 'freebsd':
    case 'sunos':
        encoding = 'utf8';
        break;
    case 'win32':
        encoding = 'cp936'
}
var result = null;
// runCommand("ping", ["-n","10","www.baidu.com"],null,()=>{
//     sendToAllClients("Over0");
// })
function runCommand(commands, args = null ,cwd = ".", callback = null) {
    result = shellspawn(commands, args, { encoding: encoding, cwd: cwd });

    //输出正常情况下的控制台信息
    result.stdout.on("data", function (data) {
        data = iconv.decode(Buffer.from(data), encoding);
        console.log("[BASH]" + data);
        sendToAllClients({ type: 'log', msg: { line: data, type: 'stdout' } });

    });
    //输出报错信息
    result.stderr.on("data", function (data) {
        data = iconv.decode(Buffer.from(data), encoding);
        console.log("[BASH]" + data);
        sendToAllClients({ type: 'log', msg: { line: data, type: 'stderr' } });
    });

    //当程序执行完毕后的回调，那个code一般是0
    result.on("exit", function (code) {
        console.log("[BASH]" + "Child process exited with code " + code);
        sendToAllClients({ type: 'log', msg: { line: code, type: 'exit' } });
        if (callback) {
            callback(code);
        }
    });
}

function sendToAllClients(msg) {
    if (websocket == null) return;
    // console.log(websocket.clients);
    websocket.clients.forEach(function each(client) {
        client.send(JSON.stringify(msg));
    });
}


function wsParser(ws, glc, acg) {
    globleConfig = glc;
    accountConfig = acg;
    websocket = ws;
    encoding = glc.get("shell-encoding", encoding);
    //处理客户端发送过来的消息	
    ws.on("connection", (connection) => {
        // console.log(connection)
        connection.on("message", function (data) {
            try {
                data = JSON.parse(data);
            } catch (e) {
                //不处理
            }
            // console.log("[SOCKET]: " + data);

            // result.stdin.write(data + "\n");
            // result.stdin.end();
            // connection.send("[Response]: " + data)
            // sendToAllClients(data);
            //监听关闭

        })
        // connection.on("open", function () {
        //     console.log("Connection closed")
        // })
        connection.on("close", function () {
            // console.log("Connection closed")
        })
        //监听异常
        connection.on("error", (err) => {
            console.log('Server Error...');
            console.error(err);
        })
    });

}

module.exports = {
    wsParser
}