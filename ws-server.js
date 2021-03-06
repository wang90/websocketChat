/**
 * 阳光课程后台
 * by wang90
 *
 * v1.1
 * 2017-9-19
 */
var fs=require('fs');
var path = require('path');
var app = require('http').createServer();

var file = {
    user:"./data/userData.json",
    teach:"./data/teachData.json",
    score:"./data/scoreData.json",
    lession:"./data/lessionData.json"
};

var result = "";
// var imgHead=[
//     "/img/user1.jpg",
//     "/img/user2.jpg",
//     "/img/user3.jpg",
//     "/img/user4.jpg",
//     "/img/user5.jpg",
//     "/img/user6.jpg",
//     "/img/user7.jpg",
//     "/img/user8.jpg",
//     "/img/user9.jpg",
//     "/img/user10.jpg",
//     "/img/user11.jpg",
//     "/img/user12.jpg",
// ]

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

var message = {
    login:{
        ok:{
            code:0,
            message:"登录成功"
        },
        err:{
            code :1001,
            message:"登录失败"
        }
    },
    res:{
      ok:{
          code :0,
          message:"注册成功",
      },
      err:{
          code :1002,
          message:"该用户存在"
      }
    },
    creatLession:{
        ok:{
            code :0,
            message:"课程创建成功"
        },
        err:{
            code :2001,
            message:"没有找到主讲名称"
        }
    },
    addlist:{
        ok:{
            code :0,
            message:"添加学生成功"
        },
        err:{
            code:3001,
            message:"学生名字重复"
        }
    },
    userlist:{
        ok:{
            code :0,
            message:"获取学生列表成功"
        },
        err:{
            code :3002,
            message:"获取学生列表失败"
        }
    },
    lession:{
        ok:{
            code:0,
            message:"获取课程信息成功"
        },
        err:{
            code :2002,
            message: "获取课程信息失败"
        }
    }

}


var io = require('socket.io')(app);
var PORT =8001;

app.listen(PORT,function () {
    console.log("启动"+PORT);
});



io.on("connection",function(socket){

    //登录
    socket.on("user",function(data){
        var obj={};
        thisLession();
        if (data.type == 1) {
            //学生登录
            result=JSON.parse(fs.readFileSync( file.user));

            for(var i = 0 ; i <result.info.length;i ++){

                if(result.info[i].name ==data.user &&result.info[i].password==data.password){
                    obj = {
                        code :message.login.ok.code,
                        info:result.info[i],
                        message:message.login.ok.message,
                    }
                    io.emit("ok", obj);
                    getUserList();
                    getLession();
                    return false;
                }
            }
            obj = {
                code :message.login.err.code,
                info:"",
                message:message.login.err.message,
            }
        }else if(data.type ==2){
            //老师登录
            result=JSON.parse(fs.readFileSync( file.teach));
            for(var i = 0 ; i <result.info.length;i ++){

                if(result.info[i].name ==data.user &&result.info[i].password==data.password){
                    obj = {
                        code :message.login.ok.code,
                        info:result.info[i],
                        message:message.login.ok.message,
                    };
                    io.emit("ok", obj);
                    getUserList();
                    getLession();
                    return false;
                }
            }
            obj = {
                code :message.login.err.code,
                info:"",
                message:message.login.err.message,
            }
        }else if(data.type ==3){
            //老师注册
            result=JSON.parse(fs.readFileSync( file.teach));
            for(var i = 0 ; i <result.info.length;i ++){

                if(result.info[i].name==data.user){
                    obj = {
                        code :message.res.err.code,
                        info:"",
                        message:message.res.err.message,
                    }
                    io.emit("ok", obj);
                    return false;
                }
            }
            var teach= {
                "teachId":result.info.length +1,
                "name":data.user,
                "teach":[],
                "help":[],
                "type":2,
                "password":data.password
            }
            if(teach){
                result.info.push(teach);
                fs.writeFileSync(file.teach, JSON.stringify(result));
                obj = {
                    code :message.res.ok.code,
                    info:teach,
                    message:message.res.ok.message,
                }
            }

        }
        io.emit("ok", obj);
        getUserList();
        getLession();

    });

    //创建课程
    socket.on("addLession",function (data) {

        var obj = {};
        result=JSON.parse(fs.readFileSync( file.teach));
        for(var i = 0 ; i <result.info.length;i ++){
            if(result.info[i].name == data.teach){
                var lessiond_id = "";

                var _result= JSON.parse(fs.readFileSync( file.lession));
                if(_result.info.length >=1 ){
                    lessiond_id =_result.info[_result.info.length -1].lessionId+1 ;
                }else{
                    lessiond_id = 0;
                }
                var _obj ={
                    "lessionId":lessiond_id,
                    "title":data.title,
                    "data":"",
                    "teach":result.info[i].teachId,
                    "helpTeach":[]
                }

                _result.info.push(_obj);
                fs.writeFileSync(file.lession, JSON.stringify(_result));
                var _creatLession = {
                    lessionId:_obj.lessionId,
                    Attendance:{},
                    Test:{},
                    Answer:{},
                    Complete:{},
                    Clean:{},
                    Points:{},
                    All:{}
                }
                var creatLession= JSON.parse(fs.readFileSync( file.score));
                creatLession.info.push(_creatLession);
                fs.writeFileSync(file.score, JSON.stringify(creatLession));

                var r_obj ={
                    name:result.info[i].name,
                    type:result.info[i].type,
                    title:_obj.title,
                    lessionId:_obj.lessionId
                }
                obj = {
                    code:message.creatLession.ok.code,
                    info:r_obj,
                    message:message.creatLession.ok.message,
                };
                thisLession();
                io.emit("creatLession",obj);
                getLession();
                getUserList();
                return false;
            }
        }
        obj = {
            code :message.creatLession.err.code,
            info:result.info[i],
            message:message.creatLession.err.message,
        };
        io.emit("creatLession", obj);

    });
    
    //删除课程
    socket.on("delLession",function (data) {

        var lession_=JSON.parse(fs.readFileSync( file.score));
        for( var i = 0 ; i < lession_.info.length ; i ++){
            if(lession_.info[i].lessionId == data.lessionId){
                lession_.info.splice(i,1);
                fs.writeFileSync(file.score,JSON.stringify(lession_));
                break;
            }
        }
        var _lession = JSON.parse(fs.readFileSync(file.lession));

        for( var j = 0 ; j < _lession.info.length ; j ++){

            if(_lession.info[j].lessionId == data.lessionId){
                _lession.info.splice(j,1);
                fs.writeFileSync(file.lession,JSON.stringify(_lession));
                break;
            }
        }

        thisLession();
        getLession();
        if(_lession.info.length>0){
            var id = _lession.info[_lession.info.length-1].lessionId;
            var _name = _lession.info[_lession.info.length-1].title
            lookLession(id,_name,data.userId,"look");
        }


    });
    
    //修改课程
    socket.on("modifyLession",function (data) {
        
    });
    
    //添加学生
    socket.on("addlist",function (data) {
        var obj ={};
        result=JSON.parse(fs.readFileSync( file.user));
        for(var i = 0 ; i<result.info.length ;i ++){
            if(result.info[i].name == data.addName){
                obj = {
                    code :message.addlist.err.code,
                    info:"",
                    message:message.addlist.err.message,
                };
                io.emit("addlist", obj);
                return false;
            }
        }
        var n = parseInt(Math.random()*10);
        var userId = 0;
        if (result.info.length>1) {
            userId = result.info[result.info.length-1].userId +1;
        }

        var _obj ={
            "userId":userId,
            "name":data.addName,
            "class":data.addClass,
            "headImg":imgHead[n],
            "score":0,
            "thisScore":0,
            "type":1,
            "password":data.addPassword
        };
        result.info.push(_obj);
        fs.writeFileSync(file.user, JSON.stringify(result));
        obj = {
            code :message.addlist.ok.code,
            info:{
                name:data.user,
                type:data.type,
                addUser:_obj.name,
            },
            message:message.addlist.ok.message,
        };
        io.emit("addlist", obj);
        getUserList();
    });
    
    //修改学生信息展示
    socket.on("modifyStudent",function (data) {
        var userData = JSON.parse(fs.readFileSync(file.user));

        var obj = {
            userId:data.userId,
            userType:data.userType,
            userName:data.userName,
            modifyId:data.modifyId
        };
        for(var i = 0 ; i < userData.info.length ; i ++){
            if(userData.info[i].userId == data.modifyId){
                obj.modifyName = userData.info[i].name;
                obj.modifyPass = userData.info[i].password;
                obj.modifyClass = userData.info[i].class;
                io.emit("modifyUser",obj);

                break;
            }
        }
    });

    //修改信息存储
    socket.on("modifyInfo",function (data) {

        var userData = JSON.parse(fs.readFileSync(file.user));
        for(var i = 0 ; i < userData.info.length ; i ++){
            if( userData.info[i].userId ==data.modifyId){

                userData.info[i].name = data.addName;
                userData.info[i].password = data.addPassword;
                userData.info[i].class = data.addClass;
                fs.writeFileSync(file.user,JSON.stringify(userData));
                getUserList();
                break;
            }
        }
    });

    //学生加分
    socket.on("addScore",function (data) {
        var scroeData = JSON.parse(fs.readFileSync( file.score));
        var thisLession = data.lessionId;
        var thisLessionData = {};
        var addobj = {
            name:data.user,
            type:data.type,
            addUser:getUserInfo(data.addId).name,
            scoreType:"",
        }
        for(var j = 0 ; j < scroeData.info.length;j++){
            if (scroeData.info[j].lessionId == thisLession) {
                switch (data.clickType-0){
                    case 1:
                        if (!scroeData.info[j].Attendance.hasOwnProperty(data.addId)) {
                            scroeData.info[j].Attendance[data.addId] = 1;
                        }
                        addobj.scoreType=1;
                        io.emit("addScore", addobj);
                        break;
                    case 2:
                        if (scroeData.info[j].Answer.hasOwnProperty(data.addId)) {
                            scroeData.info[j].Answer[data.addId]++;
                        }else{
                            scroeData.info[j].Answer[data.addId] = 1;
                        }
                        addobj.scoreType=2;
                        io.emit("addScore", addobj);
                        break;
                    case 3:
                        if (!scroeData.info[j].Clean.hasOwnProperty(data.addId)) {
                            scroeData.info[j].Clean[data.addId] = 1;
                        }
                        addobj.scoreType=3;
                        io.emit("addScore", addobj);
                        break;
                    case 4:
                        if (scroeData.info[j].Points.hasOwnProperty(data.addId)) {
                            scroeData.info[j].Points[data.addId]--;
                        }else{
                            scroeData.info[j].Points[data.addId] = -1;
                        }
                        addobj.scoreType=4;
                        io.emit("addScore", addobj);
                        break;
                    default:
                        break;
                }
                thisLessionData = scroeData.info[j];
                fs.writeFileSync(file.score,JSON.stringify(scroeData));
                getUserList();
                return false;
            }
        }

    });

    //删除学生
    socket.on("dellist",function (data) {
        var scroeData = JSON.parse(fs.readFileSync( file.score));
        var thisLession = data.lessionId;
        var thisLessionData = {};
        var delobj = {
            name:data.user,
            type:data.type,
            delUser:delUserInfo(data.delId).name,
        }

        for(var i = 0 ; i <scroeData.info.length;i++){
            if(scroeData.info[i].lessionId == thisLession){
                if (scroeData.info[i].Attendance.hasOwnProperty(data.delId)) {
                    delete scroeData.info[i].Attendance[data.delId];
                }
                if (scroeData.info[i].Answer.hasOwnProperty(data.delId)) {
                    delete scroeData.info[i].Answer[data.delId];
                }
                if (scroeData.info[i].Clean.hasOwnProperty(data.delId)) {
                    delete scroeData.info[i].Clean[data.delId];
                }
                if (scroeData.info[i].Points.hasOwnProperty(data.delId)) {
                    delete scroeData.info[i].Points[data.delId];
                }
                fs.writeFileSync(file.score,JSON.stringify(scroeData));
                return false;
            }
        }
    });

    //回复信息
    socket.on("message",function(data){
        var messageObj = {
            message:data.message,
            name:data.user,
            type:data.type
        }
        io.emit("message",messageObj);
    });

    //查看学生课程
    socket.on("lookLession",function (data) {

        var lessionData = JSON.parse(fs.readFileSync(file.lession));
        var id = 0;
        var name ="";
        for(var i = 0 ; i <lessionData.info.length;i++){
            if(lessionData.info[i].lessionId == data.lessionId){

                id = i;
                name =  lessionData.info[i].title;
                break;
            }
        }

        lookLession(id,name,data.userId,"look");
    });

    //修改学生分数
    socket.on("modifyScore",function (data) {

        var scroeData = JSON.parse(fs.readFileSync( file.score));
        var thisLession = 0;
        var name = data.LookLessionTitle;
        var userId = data.userId;

        for(var j = 0 ; j < scroeData.info.length;j++){
            if (scroeData.info[j].lessionId == data.LookLessionId) {
                thisLession = j;
                if(data.status =="no"){
                    lookLession(thisLession,name,userId,"modfiy");
                    return false;
                }
                switch (data.modifyType-0){
                    case 1:
                        if(data.status ==2){
                            if (!scroeData.info[j].Attendance.hasOwnProperty(data.addId)) {
                                scroeData.info[j].Attendance[data.addId] = 1;
                            }
                        }else if(data.status ==1){
                            if (scroeData.info[j].Attendance.hasOwnProperty(data.addId)) {
                                delete scroeData.info[j].Attendance[data.addId];
                            }
                        }
                        break;
                    case 2:
                        if (scroeData.info[j].Answer.hasOwnProperty(data.addId)) {
                            if(data.status ==2){
                                scroeData.info[j].Answer[data.addId]++;
                            }else{
                                if( scroeData.info[j].Answer[data.addId]>0){
                                    scroeData.info[j].Answer[data.addId]--;
                                }
                            }
                        }else{
                            scroeData.info[j].Answer[data.addId] = 1;
                        }
                        break;
                    case 3:
                        if(data.status ==2 ){
                            if (!scroeData.info[j].Clean.hasOwnProperty(data.addId)) {
                                scroeData.info[j].Clean[data.addId] = 1;
                            }
                        }else if(data.status ==1 ){
                            if(scroeData.info[j].Clean.hasOwnProperty(data.addId)){
                                delete scroeData.info[j].Clean[data.addId];
                            }
                        }
                        break;
                    case 4:
                        if (scroeData.info[j].Points.hasOwnProperty(data.addId)) {
                            if(data.status ==2){

                                if( scroeData.info[j].Points[data.addId]<0){
                                    scroeData.info[j].Points[data.addId]++;
                                }
                            }else{
                                scroeData.info[j].Points[data.addId]--;
                            }
                        }else{
                            scroeData.info[j].Points[data.addId] = -1;
                        }
                        break;
                    case 5:
                        if (scroeData.info[j].Test.hasOwnProperty(data.addId)) {
                            if(data.status ==2){
                                scroeData.info[j].Test[data.addId]++;
                            }else{
                                if( scroeData.info[j].Test[data.addId]>0){
                                    scroeData.info[j].Test[data.addId]--;
                                }
                            }
                        }else{
                            scroeData.info[j].Test[data.addId] = 1;
                        }
                        break;
                    case 6:
                        if (scroeData.info[j].Complete.hasOwnProperty(data.addId)) {
                            if(data.status ==2){
                                scroeData.info[j].Complete[data.addId]++;
                            }else{
                                if( scroeData.info[j].Complete[data.addId]>0){
                                    scroeData.info[j].Complete[data.addId]--;
                                }
                            }
                        }else{
                            scroeData.info[j].Complete[data.addId] = 1;
                        }
                        break;
                    default:
                        break;
                }
                fs.writeFileSync(file.score,JSON.stringify(scroeData));
                lookLession(thisLession,name,userId,"modfiy");
                getUserList();
                return false;
            }
        }
    });

   








    //获取学生列表
    function getUserList() {
        var userData = JSON.parse(fs.readFileSync(file.user));
        var scoreData = JSON.parse(fs.readFileSync(file.score));
        var thisLessionData = scoreData.info[scoreData.info.length-1];
        var userDATA =[];
        for(var j= 0 ; j <userData.info.length; j++){
            var user_q=0;
            var user_a=0;
            var user_c=0;
            var user_d=0;
            var user_t=0;
            var user_f=0;
            var userId =userData.info[j].userId;
            if(thisLessionData){
                if (thisLessionData.Attendance.hasOwnProperty(userId)) {
                    user_q = thisLessionData.Attendance[userId];
                }
                if (thisLessionData.Answer.hasOwnProperty(userId)) {
                    user_a = thisLessionData.Answer[userId];
                }
                if (thisLessionData.Test.hasOwnProperty(userId)) {
                    user_t = thisLessionData.Test[userId];
                }
                if (thisLessionData.Complete.hasOwnProperty(userId)) {
                    user_f = thisLessionData.Complete[userId];
                }
                if (thisLessionData.Clean.hasOwnProperty(userId)) {
                    user_c = thisLessionData.Clean[userId];
                }
                if (thisLessionData.Points.hasOwnProperty(userId)) {
                    user_d = thisLessionData.Points[userId];
                }
            }
            userDATA.push({
                userId:userId,
                name:userData.info[j].name,
                class:userData.info[j].class,
                headImg:userData.info[j].headImg,
                type:userData.info[j].type,
                Attendance:user_q,
                Answer:user_a,
                Test:user_t,
                Complete:user_f,
                Clean:user_c,
                Points:user_d
            });
        }

        var obj ={
            code :message.userlist.ok.code,
            info:userDATA,
            message:message.userlist.ok.message,
        }
        io.emit("list", obj);
    };
    //获取课程列表
    function getLession() {
        var lessionInfo =JSON.parse(fs.readFileSync(file.lession));
        var obj ={
            code :message.lession.ok.code,
            info:lessionInfo.info,
            message:message.lession.ok.message,
        }
        io.emit("lession",obj);
    };
    //查询学生名字
    function getUserInfo(id) {
        var userData = JSON.parse(fs.readFileSync(file.user));
        for(var i= 0 ;i <userData.info.length; i++){
            if(userData.info[i].userId == id ){
                return {
                    name :userData.info[i].name,
                    userId:userData.info[i].userId,
                    class:userData.info[i].class,
                    headImg:userData.info[i].headImg
                }
            }
        }
    };
    //删除学生
    function delUserInfo(id) {
        var userData = JSON.parse(fs.readFileSync(file.user));
        for(var i= 0 ;i <userData.info.length; i++){
            if(userData.info[i].userId == id ){
                var user=userData.info[i];
                userData.info.splice(i, 1);
                fs.writeFileSync(file.user,JSON.stringify(userData));
                getUserList();
                return {
                    name :user.name,
                    userId:user.userId,
                    class:user.class,
                    headImg:user.headImg
                }
            }
        }
    };
    //当前竞赛
    function thisLession() {
        var lessionData = JSON.parse(fs.readFileSync(file.lession));
        var id = 0;
        var name ="";
        if(lessionData.info.length>0){
          id = lessionData.info[lessionData.info.length-1].lessionId;
          name  = lessionData.info[lessionData.info.length-1].title;
        }

        var obj = {
            lessionId:id,
            lessionTitle:name
        }
        socket.emit("thisLession",obj)
    }
    //获取查看课程中学生分数
    function lookLession(id,name,userId,type) {
        var lookObj = {
            lessionName:name,
            userId:userId,
            info:[]
        }
        var userData = JSON.parse(fs.readFileSync(file.user));
        var scoreData = JSON.parse(fs.readFileSync(file.score));

        var thisLessionData = scoreData.info[id];

        var userDATA =[];
        for(var j= 0 ; j <userData.info.length; j++){
            var user_q=0;
            var user_a=0;
            var user_c=0;
            var user_d=0;
            var user_t=0;
            var user_f=0;
            var userId =userData.info[j].userId;
            if(thisLessionData){
                if (thisLessionData.Attendance.hasOwnProperty(userId)) {
                    user_q = thisLessionData.Attendance[userId];
                }
                if (thisLessionData.Answer.hasOwnProperty(userId)) {
                    user_a = thisLessionData.Answer[userId];
                }
                if (thisLessionData.Test.hasOwnProperty(userId)) {
                    user_t = thisLessionData.Test[userId];
                }
                if (thisLessionData.Complete.hasOwnProperty(userId)) {
                    user_f = thisLessionData.Complete[userId];
                }
                if (thisLessionData.Clean.hasOwnProperty(userId)) {
                    user_c = thisLessionData.Clean[userId];
                }
                if (thisLessionData.Points.hasOwnProperty(userId)) {
                    user_d = thisLessionData.Points[userId];
                }
            }
            userDATA.push({
                userId:userId,
                name:userData.info[j].name,
                class:userData.info[j].class,
                headImg:userData.info[j].headImg,
                type:userData.info[j].type,
                Attendance:user_q,
                Answer:user_a,
                Test:user_t,
                Complete:user_f,
                Clean:user_c,
                Points:user_d
            });
        }
        lookObj.info = userDATA;
        if(type =="look"){
            io.emit("lookLession",lookObj);
        }else if(type =="modfiy"){
            io.emit("modfiyLession",lookObj);
        }

    }
})



