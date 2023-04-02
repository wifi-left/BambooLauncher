function wsParser(ws) {
    //处理客户端发送过来的消息	
    ws.on("connection", (connection) => {
        // console.log(connection)
        connection.on("message", function (data) {
            try{
                data = JSON.parse(data);
            }catch(e){
                //不处理
            }
            console.log("[SOCKET]: " + data);
            connection.send("[Response]: " + data)

            //监听关闭
            
        })
        // connection.on("open", function () {
        //     console.log("Connection closed")
        // })
        connection.on("close", function () {
            console.log("Connection closed")
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