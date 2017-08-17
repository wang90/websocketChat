var app = require('http').createServer();
// var app = require("express");

var io = require('socket.io')(app);
var PORT =8001;

var path = require('path');

app.listen(PORT);


var clientCount = 0;
io.on("connection",function(socket){
  clientCount ++;
  socket.nickname = "user"+clientCount;

  io.emit("enter",socket.nickname+"进入房间");

  socket.on("message",function(data){
    console.log(data);
    io.emit("message",socket.nickname+"说:"+data);
  })
  socket.on("disconnect",function(data){
    io.emit("leave",socket.nickname+"离开房间");
  })
});
console.log("websocket server listering on port:"+PORT);



