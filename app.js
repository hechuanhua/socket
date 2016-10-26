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
var num=0,user=[]
io.on('connection', function(socket){
    socket.on('login', function (nickName) {
        num++
        console.log("有人进来了",num)
        io.sockets.emit("loginSuccess",num)//向所有人发送在线人数
        socket.broadcast.emit("welcome",nickName)//向其他人发送新人名称
        socket.on('send', function (msg) {
            socket.broadcast.emit("send1",msg)//向其他人广播消息
        });
        socket.on('disconnect',function(){
            num--
            console.log("有人退出了",num)
            io.sockets.emit("loginOut",num)
        })
    });
    


    socket.on('connect', function (msg) {
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
    });
});

http.listen(3000, function(){
    console.log('listening on *: 3000');
});