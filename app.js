var express=require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path=require('path')
//需要解释一下的是，在connection事件的回调函数中，socket表示的是当前连接到服务器的那个客户端。所以代码socket.emit('foo')则只有自己收得到这个事件，而socket.broadcast.emit('foo')则表示向除自己外的所有人发送该事件，另外，上面代码中，io表示服务器整个socket连接，所以代码io.sockets.emit('foo')表示所有人都可以收到该事件。
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname),{maxAge:0}));
var num=0,nameArray=[],userSocket={}
io.on('connection', function(socket){
    socket.on('login', function (nickName) {
        console.log(nickName+"进入了聊天室")
        nameArray.push(nickName)
        //socket.nickName=nameArray
        userSocket[nickName]=socket
        io.sockets.emit("loginSuccess",nameArray,nickName)//向所有人发送在线人数
        socket.broadcast.emit("welcome",nickName)//向其他人发送新人名称
        socket.on('send', function (user) {
            if(userSocket[user.toNickName]){
                userSocket[user.toNickName].emit("send1",user)
            }else{
                socket.broadcast.emit("send1",user)//向其他人广播消息
            }
        });
        socket.on('disconnect',function(){
            console.log(nickName+"退出了聊天室")
            var index=nameArray.indexOf(nickName)
            nameArray.splice(index,1)
            io.sockets.emit("loginOut",nameArray,nickName,index)
        })
    });
    


    /*socket.on('connect', function (msg) {
        console.log("连接成功")
    });
    socket.on('connecting', function (msg) {
        console.log("正在重连")
    });
    socket.on('connect_failed', function (msg) {
        console.log("连接失败")
    });
    socket.on('error', function (msg) {
        console.log("错误")
    });
    socket.on('reconnect_failed', function (msg) {
        console.log("重连失败")
    });
    socket.on('reconnect', function (msg) {
        console.log("成功重连")
    });
    socket.on('reconnecting', function (msg) {
        console.log("正在重连")
    });*/
});

http.listen(3000, function(){
    console.log('listening on *: 3000');
});