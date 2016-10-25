var express=require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path=require('path')

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static(path.join(__dirname),{maxAge:0}));

io.on('connection', function(socket){
    io.emit('id', socket.id);
    socket.on('chat message', function (msg) {
        console.log(socket.id)
        io.emit('chat message1', msg,socket.id);
    });
    //socket.broadcast.emit("chat likai")
    // socket.on('disconnect', function (msg) {
    //     console.log(msg,11111111111)
    //     io.emit('user disconnected');
    // });
    socket.on('disconnect1',function(msg){
        console.log("有人退出了",msg)
    })
});

http.listen(3000, function(){
    console.log('listening on *: 3000');
});