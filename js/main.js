


var socket_url = 'ws://web1.shuiqian.cc:8001';

var socket="";
var userName ="";
var userType=1;
$("#teacher").hide();
$("#userButton").click(function(){
  userName = $("#userName").val();
  if(userName){
    var user={
      user:userName,
      type:1
    };
    socket = io(socket_url);
    socket.emit('user', user);
    socketBack();
    $(".login").hide();
    $(".add-user").hide();
  }
});
$("#teachButton").click(function(){
  userName = $("#teachUser").val();
  var userPassWord =$("#teachPass").val();
  if(userPassWord=="admin"&&userName){
    userType=2;
    var user={
      user:userName,
      type:2
    };
    socket = io(socket_url);
    socket.emit('user', user);
    socketBack();
    $(".add-user").show();
    $(".login").hide();
  }
});

//展示板的信息
function showMessage(data,type){
  console.log(data);
  console.log(type);
  var dataUserNams="";
  if(data.type==1){
    dataUserNams= "[学生]"+data.user;
  }else if(data.type==2){
    dataUserNams= "[老师]"+data.user;
  }
  if(type =="message"){
    var html ="<li><span class='talk'>"+dataUserNams+"发言：</span>"+data.message+"</li>";
    $(".chart-message").append(html);
  }else if(type =="enter"){
    var html ="<li><span class='enter'>"+dataUserNams+"加入到房间</span></li>";
    $(".chart-message").append(html);
  }else if(type =="leave"){
    var html ="<li><span class='enter'>"+dataUserNams+"离开了房间</span></li>";
    $(".chart-message").append(html);
  }else  if(type =="add"){
    var html ="<li><span class='add'>"+dataUserNams+"给[学生]"+data.addUser+"1分，请继续努力</span></li>";
    $(".chart-message").append(html);
  }else if(type =="del"){
      var html ="<li><span class='add'>"+dataUserNams+"给[学生]"+data.addUser+"扣了1分,"+"请[学生]"+data.addUser+"注意您的表现</span></li>";
      $(".chart-message").append(html);

  }else if(type =="notice"){
    var html ="<li><span class='notice'>"+dataUserNams+"发一个通知请大家认真阅读</span></li>";
    $(".chart-message").append(html);
    $(".chart-notice").append("<li>"+data.message+"</li>");
    ContentHmtlBotton($(".chart-notice"));
  }else if(type =="addlist"){
    var html ="<li><span class='add'>"+dataUserNams+"添加了学生"+data.addUser+"</span></li>";
    $(".chart-message").append(html);
    ContentHmtlBotton($(".chart-user-list"));
  }else if(type=="dellist"){
    var html = "<li><span class='add'>"+dataUserNams+"删除了学生"+data.addUser+"</span></li>";
    $(".chart-message").append(html);
  }
  ContentHmtlBotton($(".chart-message"));
}
//接收到后台的事件
function socketBack(){
  socket.on("enter",function(data){
    showMessage(data,"enter");
  });
  socket.on("message",function(data){
    showMessage(data,"message");
  });
  socket.on("leave",function(data){
    showMessage(data,"leave");
  });
  socket.on("add",function(data){
    showMessage(data,"add");
  });
  socket.on("del",function(data){
    showMessage(data,"del");
  });
  socket.on("notice",function(data){
    showMessage(data,"notice");
  });
  socket.on("addlist",function(data){
    showMessage(data,"addlist");
  });
  socket.on("list",function(data){
    getStatusList(data);
  });
  socket.on("dellist",function (data) {
      showMessage(data,"dellist");
  });
}


function getStatusList(data){
  var listHtml='';
  for(var i = 0 ; i <data.info.length;i++){
    listHtml+='<li>';
    if(userType==2){
      listHtml+='<span class="add btn" onclick="addUser('+data.info[i].id+')">+</span>';
      listHtml+='<span class="del btn" onclick="delUser('+data.info[i].id+')">-</span>';
      //删除学生
      listHtml+='<span class="delUser btn" onclick="delList('+data.info[i].id+')">X</span>';
    }
    listHtml+='<img src="'+data.info[i].headImd+'"  class="fl" alt="">';
    listHtml+='<p class="fl">';
    listHtml+='<span>'+data.info[i].name+'</span><br>';
    listHtml+='<span>分数：'+data.info[i].score+'</span>';
    listHtml+='</p>';
    listHtml+='</li>';
  }
  $(".chart-user-list").html(listHtml);
  $("#studentTitle").html("学生人数："+data.info.length+"人");
}


//加分
function addUser(id){
  var addUser={
    id:id,
    user:userName,
    type:userType
  }
  socket.emit('score',  addUser);
}
//减分
function delUser(id) {
  var delUser = {
      id:id,
      user:userName,
      type:userType
  }
  socket.emit('delScore', delUser);
}




//回车回复
function CheckInfo() {
  if (event.keyCode==13) {
    addHtml();
  }
}
//回复
function addHtml(){
  var text = document.getElementById("sendTxt").value;
  if(text){
    var messageObj = {
      user:userName,
      message:text,
      type:userType
    }
    if(userType==1){
      socket.emit('message', messageObj);
    }else if(userType==2){
      socket.emit('notice', messageObj);
    }
    document.getElementById("sendTxt").value ="";
  }
}


//登陆切换
function loginTab(data){
  if(data ==1){
    $(".login-tab>li:first-child").addClass("active");
    $(".login-tab>li:last-child").removeClass("active");
    $("#student").show();
    $("#teacher").hide();
  }else if(data==2){
    $(".login-tab>li:first-child").removeClass("active");
    $(".login-tab>li:last-child").addClass("active");
    $("#student").hide();
    $("#teacher").show();
  }
}
//聊天到底部
function ContentHmtlBotton(dom){
  dom.scrollTop( dom[0].scrollHeight );
};

function addList(){
  $(".add-user-list").show();
}
// 删除学生
function delList(id){
    console.log(id);
    var valObj={
       delId :id,
       type:userType,
       user:userName
    }
    socket.emit('dellist', valObj);
}
function addUserList(){
  var val = $("#addUserName").val();
  if(val){
    var valObj = {
      addName:val,
      type:userType,
      user:userName
    }
    socket.emit('addlist', valObj);
    $(".add-user-list").hide();
  }

}



document.getElementById("sendBtn").onclick=function(){
  addHtml();
};
document.getElementById("clearHome").onclick=function(){
  var html = "";
  $(".chart-message").html(html);
};
