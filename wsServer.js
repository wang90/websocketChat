


var app = require('http').createServer();
// var app = require("express");

var fs=require('fs');
var file="./data/dataJson.json";





var result=JSON.parse(fs.readFileSync( file));

var io = require('socket.io')(app);
var PORT =8001;

var path = require('path');

app.listen(PORT);


var clientCount = 0;

var imgHead=[
    "./img/user1.jpg",
    "./img/user2.jpg",
    "./img/user3.jpg",
    "./img/user4.jpg",
    "./img/user5.jpg",
    "./img/user6.jpg",
    "./img/user7.jpg",
    "./img/user8.jpg",
    "./img/user9.jpg",
    "./img/user10.jpg",
    "./img/user11.jpg",
    "./img/user12.jpg",
]




io.on("connection",function(socket){
  //clientCount ++;
  socket.userType=1;
  result=JSON.parse(fs.readFileSync( file));
  //socket.nickname = "user"+clientCount;
  var obj = {
    user:"",
    type:1
  };

  io.emit("list", result);
  socket.on("score",function(data){
    var filestr = JSON.parse(fs.readFileSync(file));
    for(var i = 0 ; i <filestr.info.length;i++){
      if(filestr.info[i].id==data.id){
        filestr.info[i].score ++;
        fs.writeFileSync(file, JSON.stringify(filestr));
        io.emit("list", filestr);
        var addUser={
          user:data.user,
          type:data.type,
          addUser:filestr.info[i].name
        }
        io.emit("list", filestr);
        io.emit("add",addUser);
        return false;
      }
    }
  });

  socket.on("delScore",function(data){
    var filestr = JSON.parse(fs.readFileSync(file));
    for(var i = 0 ; i <filestr.info.length;i++) {
        if (filestr.info[i].id == data.id) {
            filestr.info[i].score--;
            fs.writeFileSync(file, JSON.stringify(filestr));
            io.emit("list", filestr);
            var addUser = {
                user: data.user,
                type: data.type,
                addUser: filestr.info[i].name
            }
            io.emit("list", filestr);
            io.emit("del", addUser);
            return false;
        }
    }
  })
  socket.on("user",function(data){
    obj.user=data.user;
    obj.type=data.type;
    socket.userType=data.type;
    io.emit("enter", obj);
  })
  socket.on("message",function(data){
    var messageObj = {
      message:data.message,
      user:data.user,
      type:data.type
    }
    io.emit("message",messageObj);
  })
  socket.on("notice",function(data){
    var messageObj = {
      message:data.message,
      user:data.user,
      type:data.type
    }
    io.emit("notice",messageObj);
  })
  socket.on("addlist",function(data){
    var filestr = JSON.parse(fs.readFileSync(file));
    var n = parseInt(Math.random()*10);

    var obj = {
      name:data.addName,
      id:filestr.info.length,
      headImd:imgHead[n],
      score:0
    }
    filestr.info.push(obj);
    fs.writeFileSync(file, JSON.stringify(filestr));
    io.emit("list", filestr);
    var userObj ={
      user:data.user,
      type:data.type,
      addUser:data.addName
    }
    io.emit("addlist", userObj);
  })
    //删除学生
  socket.on("dellist",function (data) {
    console.log(data);
    var filestr = JSON.parse(fs.readFileSync(file));
    // console.log(filestr);
      for(var i = 0 ; i <filestr.info.length;i++) {
          if (filestr.info[i].id == data.delId) {
              var userObj ={
                  user:data.user,
                  type:data.type,
                  addUser:filestr.info[i].name
              }
              filestr.info.splice(i,1);
              fs.writeFileSync(file, JSON.stringify(filestr));
              io.emit("list", filestr);
              io.emit("dellist", userObj);
              return false;
          }
      }

  });
  socket.on("disconnect",function(data){
    io.emit("leave",obj);
  });
});
console.log("websocket server listering on port:"+PORT);



