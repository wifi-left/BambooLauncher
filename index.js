const path = require("path");
const http = require('http');        // HTTP服务器API
const fs = require('fs');            // 文件系统API
const express = require('express');
const WS_MODULE = require("ws");

const wsserver = require("./ws.js");
// const iconv = require('iconv-lite')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const log = require('util').log;

var config = {
    "port": 25600
};

// HTML 开始处理

var app = express();    // 创建新的HTTP服务器
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/web/public/" + "index.html");
})

app.use('/public', express.static('web/public'))

app.get('*', function (req, res) {
    // console.log('404 handler..')
    res.sendFile(__dirname + '/web/public/error/404.html');
});

// HTML 处理结束
app.use((err, req, res, next) => {
    console.error(err.stack);
    let currentTime = new Date();
    let errInfo = err.message;
    res.type('text/plain');
    res.status(500).send(JSON.stringify({ "code": 500, "msg": "Something went error.", "details": errInfo }));
});

var port = 0;
var server = null;
reloadConfig();
server = app.listen(port);

// websocket 处理
ws = new WS_MODULE.Server({ server });
wsserver.wsParser(ws);


//

function reloadConfig() {
    log("Realoding the config ...")

    try {
        config = JSON.parse(fs.readFileSync("settings.json"));
    } catch (e) {
        config = {
            "port": 25600
        };
        fs.writeFileSync("settings.json", JSON.stringify(config));

    }
    try {
        if (server != null)
            server.close();
        log("Restarting the server...")
    } catch (e) {
        console.log(e);
    }
    // log()
    port = config.port; // 8123
    if (server == null) return;
    // console.log(port)
    server.listen(port);            // 在端口运行它
    // port = server.address().port;
    log(`Server is listening to ${port} port.`);
    log(`IP: 0.0.0.0:${port}`);

    // Node使用'on'方法注册事件处理程序
    // 当服务器收到新请求,则运行函数处理它

    log("服务器启动成功！");
    log("重新加载服务器配置文件。")
}

// console.log(config)
function randomPassword(size) {
    var seed = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '2', '3', '4', '5', '6', '7', '8', '9'
    );//数组
    seedlength = seed.length;//数组长度
    var createPassword = '';
    for (i = 0; i < size; i++) {
        j = Math.floor(Math.random() * seedlength);
        createPassword += seed[j];
    }
    return createPassword;
}
// var fileUpdated = false;

var password = randomPassword(7);

process.on('unhandledRejection', (err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(-1);
});
const HELPINFO = "\n--------------------------------\nhelp - Show the help message\nstop - Stop & Exit\nreload - Reload the config file.\n--------------------------------";
function runCommand() {
    readline.on(`line`, name => {
        // console.log(`你好 ${name}!`)
        if (name == 'help') {
            log(HELPINFO);
        } else if (name == 'stop') {
            try {
                server.close();
            }
            catch (e) {
                console.error(e);
            }
            log("Exiting...")
            readline.close();
            process.exit(0);
            // process
        } else if (name == 'reload') {
            reloadConfig();

        } else {
            log("Unknown commands: " + name + "\nType 'help' for help.");
        }
        // console.log(" > ")
        // console.log(1);
    });
    // runCommand();

}
(async () => {
    try {
        await runCommand();
        // process.exit(0);
    } catch (e) {
        throw e;
    }
})();