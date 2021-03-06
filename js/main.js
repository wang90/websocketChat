/**
 *
 * 阳光前台
 * by wang90
 * 2017-9-19
 * */
var socket_url = 'ws://squirrelrao.com:8001';
// var socket_url = 'ws://web1.shuiqian.cc:8001';

var socket="";

socket = io(socket_url);

var thisLessionId= 1;
var lookLessionId= 0;
socketBack();


//登录用户信息
// var userName ="";
// var userType=1;
var user={
    userName:"",
    userType:1,
    headImg:"",
    userId:"",
}
var arrLession=["一","二","三","四","五","六","七","八","九","十"];

var addStunentGrage = 0;
var studentGrageArr = [
    "一年级",
    "二年级",
    "三年级",
    "四年级",
    "五年级",
    "六年级",
    "七年级",
    "八年级",
    "九年级",
];

//学生登录
$("#userButton").click(function(){
    var userName = $("#userName").val();
    var userPassWord =$("#userpass").val();
    if(userName && userPassWord){
        user.userType=1;
        user.userName = userName;
        var obj={
            user:userName,
            type:user.userType,
            password:userPassWord
        };
        // socket = io(socket_url);
        socket.emit('user', obj);
        // socketBack();
    }
});

//老师登录
$("#teachButton").click(function(){
    var userName = $("#teachUser").val();
    var userPassWord =$("#teachPass").val();
    if(userPassWord&&userName){
        user.userType=2;
        user.userName = userName;
        var obj={
            user:userName,
            type:user.userType,
            password:userPassWord
        };
        // socket = io(socket_url);
        socket.emit('user', obj);
        // socketBack();
    }
});

//老师注册
$("#teacchResButton").click(function(){
    var userName = $("#teachUser").val();
    var userPassWord =$("#teachPass").val();
    if(userPassWord&&userName){
        user.userType=2;
        user.userName = userName;
        var obj={
            user:userName,
            type:3,
            password:userPassWord
        };
        // socket = io(socket_url);
        socket.emit('user', obj);
        // socketBack();
    }
});

//老师点击创建课程
$(".addLession").click(function () {
    $(".add-lession").show();
    $(".add-lession>.list-box").show();
});

//创建课程
function addLession() {
    var lessionTitle = $("#addLessionName").val();
    var lessionTeach = $("#addLessionTeach").val();
    if(lessionTitle){
        lessionTeach = lessionTeach ?lessionTeach:user.userName;
        var obj = {
            title:lessionTitle,
            teach:lessionTeach,
            id:user.userId
        }
        socket.emit("addLession",obj)
    }
};

//打开删除课程弹窗
function delLession() {
    $("#delLessionModel").show();
}
//关闭删除课程弹窗
function closeDelLessionModel() {
    $("#delLessionModel").hide();
}
function okDelThisLession() {

    var obj = {
        lessionId : lookLessionId,
        type:user.userType,
        user:user.userName,
        userId:user.userId
    }
    socket.emit("delLession",obj)
}

//添加学生弹窗
function addList(){
    addStunentGrage = 0;
    $("#addUserBtn").attr({"data-type":"add","data-id":""});
    $("#addUserName").val("");
    $("#addUserClass").val("");
    $(".list-grade > ul > li").each(function (i,e) {
        if(i ==0 &&(!$(e).hasClass("active"))){
            $(e).addClass("active");
        }else{
            $(e).removeClass("active");
        }
    });
    $(".add-user-list").show();
}

//添加学生显示
function addUserList(){
    var type = $("#addUserBtn").attr("data-type");
    var val = $("#addUserName").val();
    var v_class =$("#addUserClass").val();

    if(val && v_class){
        var valObj = {
            addName:val,
            addClass:addStunentGrage,
            addPassword:v_class,
            type:user.userType,
            user:user.userName
        }
        if(type == "modify"){

            valObj.modifyId = $("#addUserBtn").attr("data-id");
            socket.emit('modifyInfo', valObj);
        }else if(type =="add"){

            if (valObj.hasOwnProperty("modifyId")) {
                delete valObj.modifyId;
            }
            socket.emit('addlist', valObj);
        }

    }
}

//添加学生的年级
$(".list-grade > ul > li").each(function (index,e) {
    $(e).click(function (e) {
        var _this = this;
        addStunentGrage = index;
        $(_this).addClass("active").siblings().removeClass("active");
    })
})

//学生加分
function addScore(id,type){

    var obj = {
        type:user.userType,
        user:user.userName,
        addId:id,
        lessionId:thisLessionId,
        clickType:type,
        addUserName:""
    }
    socket.emit("addScore",obj);
}

function closeAddUserModel() {
    $(".add-user-list").hide();
}

//删除学生
function delList(id){

    var valObj={
        delId :id,
        type:user.userType,
        user:user.userName,
        lessionId:thisLessionId,
        delUserName:""
    }
    socket.emit('dellist', valObj);
}

//学生展示
function getStatusList(data){
    var listHtml='';
    for(var i = 0 ; i <data.info.length;i++){
        var _name = data.info[i].name;
        listHtml+='<li>';
        if(user.userType==2){

            if(data.info[i].Attendance>=1){
                listHtml+='<span class="add_q btn un-click">勤</span>';
            }else{
                listHtml+='<span class="add_q btn"'+
                    'onclick="addScore('+data.info[i].userId+',1)">勤</span>';
            }
            listHtml+='<span class="add_d btn"'+
                'onclick="addScore('+data.info[i].userId+',2)">答</span>';
            if(data.info[i].Clean>=1){
                listHtml+='<span class="add_z btn un-click">值</span>';
            }else{
                listHtml+='<span class="add_z btn"'+
                    'onclick="addScore('+data.info[i].userId+',3)">值</span>';
            }

            listHtml+='<span class="del btn"'+
                'onclick="addScore('+data.info[i].userId+',4)">违</span>';
            //删除学生
            listHtml+='<span class="delUser btn"' +
                ' onclick="delList('+data.info[i].userId+')">删</span>';
        }
        listHtml+='<img src="'+data.info[i].headImg+'"  class="fl" alt="">';
        listHtml+='<p class="fl">';
        if(user.userType==2){
            listHtml+='<span class="userModity" onclick="userModifyModule('+data.info[i].userId+')">改</span>';
        }
        listHtml+='<span>'+_name+'</span><br>';
        listHtml+='<span>出勤:'+data.info[i].Attendance+'</span>';
        listHtml+='<span>发言:'+data.info[i].Answer+'</span>';
        listHtml+='<span>测试:'+data.info[i].Test+'</span>';
        listHtml+='<span>达标:'+data.info[i].Complete+'</span>';
        listHtml+='<span>值日:'+data.info[i].Clean+'</span>';
        listHtml+='<span>违纪:'+data.info[i].Points+'</span>';
        var all = data.info[i].Attendance +data.info[i].Answer+data.info[i].Test+data.info[i].Complete+data.info[i].Clean +data.info[i].Points;
        listHtml+='<span>合计:'+all+'</span>';
        listHtml+='</p>';
        listHtml+='</li>';
    }
    $(".chart-user-list").html(listHtml);
    $("#studentTitle").html("学生人数："+data.info.length+"人");
}

//获取课程列表
function getLession(data) {
    var html ='';
    html+='<ul>';
    for(var i = 0 ; i < data.length;i++){
        if(i<10){
            if(i == (data.length -1)){
                html+='<li class="active" onclick="clickLession('+data[i].lessionId+')">'+arrLession[i]+'</li>';
            }else{
                html+='<li onclick="clickLession('+data[i].lessionId+')">'+arrLession[i]+'</li>';
            }

        }
    }
    html+='</ul>';
    $(".lession-list").html(html);
}

//获取想要的课程
function clickLession(data){

    $(".lession-list").css({
        position:"fixed",
        right: "50%",
        marginRight:"-495px",
        zIndex:"999999",
        top:"80px"
    });
    var lookObj = {
        lessionId:data,
        userId:user.userId
    }
    lookLessionId = data;
    $(".modiy").show();
    $(".lession-list >ul>li").each(function (index,e) {
        $(e).click(function () {
            var _this = this ;
            $(_this).addClass("active").siblings().removeClass("active");
        })
    })

    socket.emit("lookLession",lookObj);
}

//关闭查看
function closeLook() {
    $(".lession-box").hide();
    $(".lession-list").css({
        position:"absolute",
        right: "-40px",
        marginRight:"0",
        zIndex:"99",
        top:"80px"
    });
    $(".lession-list >ul>li").each(function (index,e) {
        $(e).removeClass("active");
    });
    $(".lession-list >ul>li:last-child").addClass("active");

}

//登陆切换
function loginTab(data){
    $("#loginMessage").html("");
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

//清屏
function clickScreen() {

    var html = "";
    $(".chart-message").html(html);
};

//回车回复
function CheckInfo() {
    if (event.keyCode==13) {
        addHtml();
    }
};

//回复
function addHtml(){
    var text = document.getElementById("sendTxt").value;
    if(text){
        var messageObj = {
            user:user.userName,
            message:text,
            type:user.userType
        }
        socket.emit('message', messageObj);
        // if(userType==1){
        //
        // }else if(userType==2){
        //     socket.emit('notice', messageObj);
        // }
        document.getElementById("sendTxt").value ="";
    }
};

//修改学生分数
function modiy() {
    $(".modiy").hide();
    modifyScore("no",0,0);
};

function userModifyModule(id) {

    var obj = {
        modifyId : id,
        userName:user.userName,
        userType:user.userType,
        userId: user.userId
    }
    $("#addUserBtn").attr({"data-type":"add","data-id":id});
    socket.emit("modifyStudent",obj);
};

//修改获取学生得分数据
function modifyScore(type,id,socreType) {

    var title =$(".lession-title").html();
    var modifyObj = {
        modifyType:socreType,
        status:type,
        addId:id,
        LookLessionId:lookLessionId,
        userId : user.userId,
        LookLessionTitle:title
    }
    socket.emit("modifyScore",modifyObj);
}

//展示板的信息
function showMessage(data,type){

    var dataUserNams="";
    if(data.type==1){
        dataUserNams= "[学生]"+data.name;
    }else if(data.type==2){
        dataUserNams= "[老师]"+data.name;
    }

    if(type =="message"){
        var html ="<li><span class='talk'>"+dataUserNams+"发言：</span>"+data.message+"</li>";
        $(".chart-message").append(html);
    } else if(type == "login"){
        var html ="<li><span class='enter'>"+dataUserNams+"加入到房间</span></li>";
        $(".chart-message").append(html);
    }else if(type =="creatLession"){
        var html ="<li><span class='add'>"+dataUserNams+"创建了的一节课---《"+data.title+"》，同学要好好表现了</span></li>";
        $(".chart-message").append(html);
    }else  if(type =="addlist"){
        var html ="<li><span class='add'>"+dataUserNams+"添加了[学生]"+data.addUser+"</span></li>";
        $(".chart-message").append(html);
        ContentHmtlBotton($(".chart-user-list"));
    }else if(type =="addScore"){
        var addScoreType="";
        switch (data.scoreType-0){
            case 1:
                addScoreType ="[学生]"+data.addUser+"因为今天出勤，被"+dataUserNams+"加1分";
                break;
            case 2:
                addScoreType ="[学生]"+data.addUser+"因回答问题，被"+dataUserNams+"加1分";
                break;
            case 3:
                addScoreType ="[学生]"+data.addUser+"因课后留下做值日，被"+dataUserNams+"加1分";
                break;
            case 4:
                addScoreType ="[学生]"+data.addUser+"因违法课堂纪律，被"+dataUserNams+"扣除1分";
                break;
        }
        var html ="<li><span class='add'>"+addScoreType+"</span></li>";
        $(".chart-message").append(html);
    }
    ContentHmtlBotton($(".chart-message"));








    // if(type =="message"){
    //     var html ="<li><span class='talk'>"+dataUserNams+"发言：</span>"+data.message+"</li>";
    //     $(".chart-message").append(html);
    // }else if(type =="enter"){
    //     var html ="<li><span class='enter'>"+dataUserNams+"加入到房间</span></li>";
    //     $(".chart-message").append(html);
    // }else if(type =="leave"){
    //     var html ="<li><span class='enter'>"+dataUserNams+"离开了房间</span></li>";
    //     $(".chart-message").append(html);
    // }else  if(type =="add"){
    //     var html ="<li><span class='add'>"+dataUserNams+"给[学生]"+data.addUser+"1分，请继续努力</span></li>";
    //     $(".chart-message").append(html);
    // }else if(type =="del"){
    //     var html ="<li><span class='add'>"+dataUserNams+"给[学生]"+data.addUser+"扣了1分,"+"请[学生]"+data.addUser+"注意您的表现</span></li>";
    //     $(".chart-message").append(html);
    //
    // }else if(type =="notice"){
    //     var html ="<li><span class='notice'>"+dataUserNams+"发一个通知请大家认真阅读</span></li>";
    //     $(".chart-message").append(html);
    //     $(".chart-notice").append("<li>"+data.message+"</li>");
    //     ContentHmtlBotton($(".chart-notice"));
    // }else  if(type=="dellist"){
    //     var html = "<li><span class='add'>"+dataUserNams+"删除了学生"+data.addUser+"</span></li>";
    //     $(".chart-message").append(html);
    // }
    // ContentHmtlBotton($(".chart-message"));
}

//接收到后台的事件
function socketBack(){

    //登录返回状态
    socket.on("ok",function (data) {
        $("#loginMessage").html("");
        if(data.code ==0){
            if(data.info.name==user.userName &&(!user.userId)){
                user.userType = data.info.type;
                user.headImg = data.info.headImg;

                $(".login").hide();

                var userVal = "";
                if(user.userType ==1) {
                    user.userId = data.info.userId;
                    userVal = "你好："+user.userName+"同学";
                }else if(user.userType==2){
                    user.userId = data.info.teachId;
                    userVal = "你好："+user.userName+"老师";
                    $(".addLession").show();
                    $(".add-user").show();
                    $(".lession-list").show();
                }
                $("#userInfo").html(userVal);
            }
            showMessage(data.info,"login");
        }else{
            $("#loginMessage").html(data.message);
            return false;
        }
    });

    //创建课程
    socket.on("creatLession",function (data){
        if(data.code ==0){
            $(".add-lession").hide();
            showMessage(data.info,"creatLession");
        }
    });

    //添加学生
    socket.on("addlist",function(data){
        if(data.code ==0){
            $(".add-user-list").hide();
            $("#addUserName").val("");
            $("#addUserClass").val("");
            showMessage(data.info,"addlist");
        }
    });

    //修改学生信息展示
    socket.on("modifyUser",function (data) {
        if(data.userId == user.userId && user.userType==2){
            $("#addUserBtn").attr("data-type","modify");
            $(".add-user-list").show();
            $("#addUserName").val(data.modifyName);
            $("#addUserClass").val(data.modifyPass);
            $(".list-grade > ul >li").each(function (i,e) {
                $(e).removeClass("active");
                if(i == data.modifyClass){
                    $(e).addClass("active");
                }
            });
        }
    });

    //获取学生列表
    socket.on("list",function(data){
        if(data.code ==0){
            $(".add-user-list").hide();
            getStatusList(data);
        }
    });

    //获取课程信息
    socket.on("lession",function (data) {
        if(data.code ==0){
            getLession(data.info);
            $("#delLessionModel").hide();
        }
    });

    //当前课程ID
    socket.on("thisLession",function (data) {
        thisLessionId =data.lessionId;
        $("#lessionTitle").html(data.lessionTitle);
    })

    //获取学生加减分
    socket.on("addScore",function (data) {
        showMessage(data,"addScore");
    })

    //获取发送信息
    socket.on("message",function(data){
        showMessage(data,"message");
    });

    //获取学生课程列表
    socket.on("lookLession",function (data) {
        if(data.userId == user.userId && user.userType==2) {
            $(".lession-box").show();
            $(".lession-title").html(data.lessionName);
            var html = '';
            for (var i = 0; i < data.info.length; i++) {
                var user_id = data.info[i].userId;
                var allScore =
                    data.info[i].Attendance +
                    data.info[i].Answer +
                    data.info[i].Test +
                    data.info[i].Complete +
                    data.info[i].Clean +
                    data.info[i].Points;
                html += '<ul>' +
                    '<li>' + (i + 1) + '</li>' +
                    '<li>' + data.info[i].name + '</li>' +
                    '<li>' + studentGrageArr[data.info[i].class] + '</li>' +
                    '<li>' + data.info[i].Attendance + '</li>' +
                    '<li>' + data.info[i].Answer + '</li> ' +
                    '<li>' + data.info[i].Test + '</li>' +
                    '<li>' + data.info[i].Complete + '</li>' +
                    '<li>' + data.info[i].Clean + '</li>' +
                    '<li>' + data.info[i].Points + '</li>' +
                    '<li>' + allScore + '</li>' +
                    '</ul>';
            }
            $("#lessionStudentList").html(html);
            $(".modiy").show();
        };
    });
    
    //修改完毕的课表
    socket.on("modfiyLession",function (data) {
        if(data.userId == user.userId && user.userType==2) {
            var html = '';
            for (var i = 0; i < data.info.length; i++) {
                var user_id = data.info[i].userId;
                var allScore =
                    data.info[i].Attendance +
                    data.info[i].Answer +
                    data.info[i].Test +
                    data.info[i].Complete +
                    data.info[i].Clean +
                    data.info[i].Points;
                html += '<ul>';
                html += '<li>' + (i + 1) + '</li>';
                html += '<li>' + data.info[i].name + '</li>';
                html += '<li>' + data.info[i].class + '</li>';

                //出勤
                html +='<li>';
                if(data.info[i].Attendance ==1 ){
                    html +='<span class="add" onclick="modifyScore(1,'+user_id+',1)">-</span>';
                    html += data.info[i].Attendance;
                }else {
                    html += data.info[i].Attendance;
                    html +='<span class="del" onclick="modifyScore(2,'+user_id+',1)">+</span>';
                };
                html += '</li>';

                //回答
                html += '<li>';
                if(data.info[i].Answer>0){
                    html +='<span class="add" onclick="modifyScore(1,'+user_id+',2)">-</span>';
                    html += data.info[i].Answer;
                    html +='<span class="del" onclick="modifyScore(2,'+user_id+',2)">+</span>';
                }else{
                    html +=  data.info[i].Answer ;
                    html +='<span class="del" onclick="modifyScore(2,'+user_id+',2)">+</span>';
                }
                html += '</li>';

                //测试
                html += '<li>';
                if(data.info[i].Test>0){
                    html +='<span class="add" onclick="modifyScore(1,'+user_id+',5)">-</span>';
                    html += data.info[i].Test;
                    html +='<span class="del" onclick="modifyScore(2,'+user_id+',5)">+</span>';
                }else{
                    html +=  data.info[i].Test ;
                    html +='<span class="del" onclick="modifyScore(2,'+user_id+',5)">+</span>';
                }
                html += '</li>';

                //达标
                html += '<li>';
                if(data.info[i].Complete>0){
                    html +='<span class="add" onclick="modifyScore(1,'+user_id+',6)">-</span>';
                    html += data.info[i].Complete;
                    html +='<span class="del" onclick="modifyScore(2,'+user_id+',6)">+</span>';
                }else{
                    html +=  data.info[i].Complete ;
                    html +='<span class="del" onclick="modifyScore(2,'+user_id+',6)">+</span>';
                }
                html += '</li>';

                //值日
                html +='<li>';
                if(data.info[i].Clean ==1 ){
                    html +='<span class="add" onclick="modifyScore(1,'+user_id+',3)">-</span>';
                    html += data.info[i].Clean;
                }else {
                    html += data.info[i].Clean;
                    html +='<span class="del" onclick="modifyScore(2,'+user_id+',3)">+</span>';
                };
                html += '</li>';

                //违纪
                html += '<li>';
                if(data.info[i].Points<0){
                    html +='<span class="add" onclick="modifyScore(1,'+user_id+',4)">-</span>';
                    html += data.info[i].Points;
                    html +='<span class="del" onclick="modifyScore(2,'+user_id+',4)">+</span>';
                }else{
                    html +='<span class="add" onclick="modifyScore(1,'+user_id+',4)">-</span>';
                    html +=  data.info[i].Points ;
                }
                html += '</li>';

                //合计
                html +='<li>' + allScore + '</li>';
                html +='</ul>';
            }
            $("#lessionStudentList").html(html);
            $(".lession-student-list  ul>li").each(function (i,ele) {
                $(ele).find("span").show();
            })
        };
    });

    socket.on("enter",function(data){
        showMessage(data,"enter");
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

    socket.on("dellist",function (data) {
        showMessage(data,"dellist");
    });
};




