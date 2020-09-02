var dragFlag = {
    id:"",
    x:0,
    y:0
};
var Websocket;
var ChatUser;
var ChatIDP;
var ChatID;
var ChatName;
var ChatNewsL;
var ChatNewsR;
var ChatNewsH;
var ChatPage = 1;
var ChatSearchResult;
var ChatSearchHint; 
var ChatOnlinelist;
var ChatHeart = false;
var ChatGnewID;
document.onmousedown = function (e) {
    e = e || window.event;
    dragFlag.id = e.target;
    dragFlag.x = e.offsetX;
    dragFlag.y = e.offsetY;
    for(var i = 0,k = 0;i < PHPChat.children.length;i++){
        if(PHPChat.children[i].id == dragFlag.id.id)PHPChat.children[i].style.zIndex = PHPChat.children.length - 1;
        else PHPChat.children[i].style.zIndex = k++;
    }
};
document.onmousemove = function (e) {
    if(dragFlag.id != ""){
        if(dragFlag.id.className == "Drag"){
            e = e || window.event;
            x = e.clientX - dragFlag.x;
            y = e.clientY - dragFlag.y;
            if(x >= 0 && x <= document.body.offsetWidth - dragFlag.id.offsetWidth)dragFlag.id.style.left = x;
            else if(x < 0)dragFlag.id.style.left = 0;
            else if(x > document.body.offsetWidth - dragFlag.id.offsetWidth)dragFlag.id.style.left = document.body.offsetWidth - dragFlag.id.offsetWidth;
            if(y >= 0 && y <= document.body.offsetHeight - dragFlag.id.offsetHeight)dragFlag.id.style.top = y;
            else if(y < 0)dragFlag.id.style.top = 0;
            else if(y > document.body.offsetHeight - dragFlag.id.offsetHeight)dragFlag.id.style.top = document.body.offsetHeight - dragFlag.id.offsetHeight;
        }
    }
};
document.onmouseup = function (e) {
    dragFlag.id = "";
};
window.onresize = function(e){
    //窗口改变事件
}

function visible(id){
    if(id.type == "password")id.type = "text";
    else if(id.type == "text")id.type = "password";
}
function Box(str){
    if(str == "none"){
        LoginBox.style.display = str;
        RegistBox.style.display = "block";
    }else if(str == "block"){
        LoginBox.style.display = str;
        RegistBox.style.display = "none";
    }
}
function clearLoginhint(){
    $("#loginhint span").text("");
}
function clearRegisthint(){
    $("#registhint span").text("");
}
function Options(i){
    ChatPage = i;
    if(i == 1){
        $("#PHPChatOptionroll").animate({left:'0px'});
        $(".listbox").animate({marginLeft:'0px'});
    }else if(i == 2){
        $("#PHPChatOptionroll").animate({left:'33.33%'});
        $(".listbox").animate({marginLeft:'-260px'});
        //打开大厅聊天对话框
        GChat(1);
    }else if(i == 3){
        $("#PHPChatOptionroll").animate({left:'66.66%'});
        $(".listbox").animate({marginLeft:'-520px'});
    }
}
function openlist(dom){
    if($(dom).attr("value") == "true"){
        $(dom).children().first().attr("src","./src/listopen.svg");
        $(dom).attr("value","false");
        $(dom).next().show();
    }
    else if($(dom).attr("value") == "false"){
        $(dom).children().first().attr("src","./src/listclose.svg");
        $(dom).attr("value","true");
        $(dom).next().hide();
    }   
}
function listover(dom,a){
    if(a == 1){
        $(dom).children().last().show();
        $(dom).children().next().first().children(".listnewsnum").hide();
    }else if(a == 0){
        $(dom).children().last().hide();
        if($(dom).find(".listnewsnum").text() != 0)$(dom).find(".listnewsnum").show();
    }
}
function searchbox(is){
    if(is == true){
        $("#PHPChatSearchlist").show();
    }else if(is == false){
    }
}
function Selected(dom){
    dom.parent().find(".selected").removeClass("selected");
    if(dom[0].className == ""){
        dom.addClass("selected");
    }
    dom.find(".listnewsnum").hide().text(0);
}
function Closelist(dom){
	dom = dom.parent().parent();
	if(dom.parent().children().length <= 2)$("#ChatWin .ChatUserlist").hide();
	if(dom.val() == ChatIDP){
		if(dom.prev().length > 0)Chat(dom.prev().val());
		else if(dom.next().length > 0)Chat(dom.next().val());
	}
	dom.remove();
}
function CloseWin(dom){
	dom.parent().parent().hide();
	//列表清空
    ChatIDP = 0; 
    if(dom.parent().parent()[0].id == "ChatWin"){
        $("#ChatWin .ChatUserlist li").remove();
        $("#ChatWin .ChatUserlist").hide();
    }else if(dom.parent().parent()[0].id == "UserInfoWin"){
        $("#UserInfoWin .usereditBox").hide();
        $("#UserInfoWin .userBox").show();
    }
}
$(document).ready(function(){
    $("#ChatWin .ChatUserlist li").on("click",function(event){
        // console.log($(event.delegateTarget).attr("value"));
        if(event.target.nodeName == "IMG"){
         Closelist($(event.target));
        }
        else if($(event.delegateTarget).attr("value").substring(0,1) != "G")Chat(event.delegateTarget.value);
        else GChat(parseInt($(event.delegateTarget).attr("value").substring(1)));
    });
    $("#PHPChatlistbox1 .listbody li").on("click",function(event){
        if(event.target.classList[0] == "listuserhead"){
            getuserdata(event.delegateTarget.value);
        }else Chat(event.delegateTarget.value);
    });
	ChatNewsL        = $("#ChatUsernews").children().first().clone(true);
	ChatNewsR        = $("#ChatUsernews").children().first().next().clone(true);
	ChatNewsH        = $("#ChatUsernews").children().first().next().next().clone(true);
    ChatSearchResult = $("#PHPChatSearchlist li").clone(true);
    ChatSearchHint   = $("#PHPChatSearchlist .listnull").clone(true);
    ChatUser         = $("#ChatWin .ChatUserlist li").clone(true);
    ChatOnlinelist   = $("#PHPChatlistbox2 .listbody li").first().clone(true);
    $("#PHPChatlistbox2 .listbody li").remove();
    $("#PHPChatSearchlist li").children().remove();
	$("#ChatUsernews li").remove();
    $("#ChatWin .ChatUserlist li").remove();
    $("#Input").keydown(function(event){
        if (((event.altKey) && event.keyCode == 83) || ((event.altKey || event.ctrlKey)&& event.keyCode == 13)) {
            Send(event.target.value);
            $("#Input").val("");
        }
    });
    $(document).click(function(event){
        if($(event.target).parents("#PHPChatSearchlist").attr("id") != "PHPChatSearchlist" && $(event.target).attr("id") != "PHPChatSearch"){
            $("#PHPChatSearchlist").hide();
            $("#PHPChatSearch").val("");
            $("#PHPChatSearchlist").children().remove();
            ChatSearchHint.clone(true).appendTo("#PHPChatSearchlist");
        }
    });
    AutoLogin();
});
function Login(){
    console.log("登陆");
    if(user.value != "" && pass.value != ""){
        $.ajax({
            type: "POST",
            url: "user/init/login",
            data: "account=" + user.value + "&password=" + pass.value,
            success: function(data){
                console.log(data);
                if(remember.checked == true){
                    setCookie("PHPChatUser",user.value,"d7");
                    setCookie("PHPChatPass",data.password,"d7");
                }
                if(data.result == 1){
                    //登陆成功
                    ChatID = data.user_id;
                    Online();
                }else if(data.result == 0){
                    if(data.code == "001"){
                        $("#loginhint span").text("账号或密码错误");
                    }else{
                        console.log(data.code);
                    }
                }
            }
        });
    }else{
        $("#loginhint span").text("账号和密码不能为空");
    }
    return false;
}
function Regist(){
    if(Ruser.value != "" && Rpass.value != "" && Rname.value != ""){
        $.ajax({
            type: "POST",
            url: "index.php/user/init/regist",
            data: "account=" + Ruser.value + "&password=" + Rpass.value + "&name=" + Rname.value,
            success: function(data){
                console.log(data);
                if(data.result == 1){
                    //注册成功
                    ChatID = data.user_id;
                    Online();
                }else if(data.result == 0){
                    if(data.code == "002"){
                        $("#loginhint span").text("账号已存在");
                        alert("账号已存在")
                    }else{
                        console.log(data.code);
                        alert("注册失败")
                    }
                }
            }
        });
    }else{
        $("#registhint span").text("请完善注册信息");
    }
    return false;
}
function AutoLogin(){
    $.ajax({
        type: "POST",
        url: "index.php",
        data: "",
        success: function(data){
            console.log(data);
            if(data.result == 1){
                ChatID = data.user_id;
                Online();
            }else if(data.result == 0){
                //查询cookie 自动登录
                var Luser = getCookie("PHPChatUser");
                var Lpass = getCookie("PHPChatPass");
                if(Luser != null && Lpass != null){
                    $.ajax({
                        type: "POST",
                        url: "index.php/user/init/login",
                        data: "account=" + Luser + "&password=" + Lpass,
                        success: function(data){
                            console.log(data);
                            if(data.result == 1){
                                //登陆成功
                                // $("#LoginWin").hide();
                                // $("#ListWin").show();
                                ChatId = data.user_id;
                                Online();
                            }else if(data.result == 0){
                                console.log(data.result);
                            }
                        }
                    });
                }else{
                    $("#LoginWin").show();
                }
            }
        }
    });
}
function Chathint(hint){
	var list = ChatNewsH.clone(true).prependTo("#ChatUsernews");
	list.find(".listtime").html(hint);
}
function Notice(title,content,type){
    if(type == 1){
        return "<div class='newsHeader'>"+title+"</div><div class='newsBodyer'>"+content.name+"("+content.account+")<br>"+content.content+"</div><div class='newsFooter'><button class='newsTrue shou' onclick='FriendAgree(this,"+content.friend_id+")'>同意</button><button class='newsFalse shou' onclick='FriendRefuse(this,"+content.friend_id+")'>拒绝</button></div>";
    }else if(type == 2){
        return "<div class='newsHeader'>"+title+"</div><div class='newsBodyer'>"+content.name+"("+content.account+")<br>"+content.content+"</div><div class='newsFooter'><div class='newsTrue'>已同意</div></div>";
    }else if(type == 3){
        return "<div class='newsHeader'>"+title+"</div><div class='newsBodyer'>"+content.name+"("+content.account+")<br>"+content.content+"</div><div class='newsFooter'><div class='newsFalse'>已拒绝</div></div>";
    }
}
function Chatnews(name,content,i,type){
	var list;
	if(i == 0){
        list = ChatNewsL.clone(true);
        list.find(".Llisthead").text(name.substring(0,1));
        list.find(".Llistname").text(name);
        if(type == 0){
            list.find(".Llistnews").text(content.content);
        }else if(type >= 1 && type <= 3){
            list.find(".Llistnews").html(Notice(content.title,content,content.type));
        }else{
            console.log("通知未识别代码");
        }
	}else if(i == 1){
		list = ChatNewsR.clone(true);
		list.find(".Rlistnews").text(content.content);
        list.find(".Rlisthead").text(ChatName.substring(0,1));
        list.find(".Rlistname").text(ChatName);
	}else{
        console.log(content);
    }
    list.prependTo("#ChatUsernews");
}
function scroll(s){
	var y = $("#ChatUsernews")[0].scrollHeight - $("#ChatUsernews")[0].offsetHeight
	$("#ChatUsernews").animate({"scrollTop":y},s);
}
function ClosePHPChat(){
    $.ajax({
        type: "POST",
        url: "index.php/user/init/quite",
        data: "",
        success: function(data){
            if(data.result == 1){
                Websocket.close();
                $("#ListWin").hide();
                $("#LoginWin").show();
                $("#ChatWin").hide();
                $("#UserInfoWin").hide();

                $("#PHPChatlistbox2 .listbody li").remove();
                $("#PHPChatSearchlist li").children().remove();
                $("#ChatUsernews li").remove();
                $("#ChatWin .ChatUserlist li").remove();
                $("#ChatWin .ChatUserlist li").remove();
                $("#ChatWin .ChatUserlist").hide();
                $("#UserInfoWin .usereditBox").hide();
                $("#UserInfoWin .userBox").show();
                ChatHeart = false;
                //清除cookie
                
            }
        }
    });
}
function timedeal(data){
    var date = new Date();
    var time =  "error";
    var year = data.substring(0,4);
    var month = data.substring(5,7);
    var day = data.substring(8,10);
    if(year == date.getFullYear()){
        if(month == date.getMonth() + 1){
            if(day == date.getDate())time = data.substring(11,16);
            else if(day == date.getDate() - 1)time = "昨天";
            else if(day == date.getDate() - 2)time = "前天";
            else  time = data.substring(0,10);
        }else time = data.substring(0,10);
    }else time = data.substring(0,10);
    return time;
}
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else return null;
}
function setCookie(name,value,time)
{
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec*1);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getsec(str)
{
    var str1=str.substring(1,str.length)*1;
    var str2=str.substring(0,1);
    if (str2=="s")
    {
        return str1*1000;
    }
    else if (str2=="h")
    {
        return str1*60*60*1000;
    }
    else if (str2=="d")
    {
        return str1*24*60*60*1000;
    }
}
function edit(is){
    if(is == 1){
        $("#UserInfoWin .userBox").hide();
        $("#UserInfoWin .usereditBox").show();
    }else if(is == 0){
        $("#UserInfoWin .userBox").show();
        $("#UserInfoWin .usereditBox").hide();
    }
}
function Online(){
    Websocket = new WebSocket("ws://119.23.206.106:1111");
    Websocket.onopen = function()
    {
        console.log("连接成功");
        ChatHeart = true;
        setInterval("heartbeat()",5000);
    };
    Websocket.onmessage = function (evt) 
    {
        var data = JSON.parse(evt.data);
        console.log(evt.data);
        if(data.command == "100"){
            $.ajax({
                type: "POST",
                url: "index.php/index/build/index",
                data: "client_id=" + data.client_id,
                success: function(data){
                    console.log(data);
                    if(data.result == 1){
                        $("#LoginWin").hide();
                        $("#ListWin").show();
                        var userdata = getUserInfo(0);
                        ChatID = userdata.id;
                        $("#PHPChatUserHead").text(userdata.name.substring(0,1));
                        $("#PHPChatUserName").text(userdata.name);
                        $("#PHPChatUserSign").text(userdata.describe);
                        ChatName = userdata.name;
                        getFriendList();
                        getOnlineList();
                    }
                }
            });
        }else if(data.command == "101"){
        	//好友上线
            var list = $("#PHPChatlistbox1 .listbody li[value='" + data.user_id + "']");
        	list.find(".listuserhead").removeClass("noline").addClass("online");
            $("#PHPChatlistbox1 .listbody li").first().after(list);
            var list = $("#PHPChatlistbox2 .listbody li[value='" + data.user_id + "']");
            if(list.length == 0 && data.user_id != ChatID){
                $.ajax({
                    type: "POST",
                    url: "index.php/user/message/get",
                    data: "user_id=" + data.user_id,
                    success: function(data){
                        console.log(data);
                        list = ChatOnlinelist.clone(true);
                        list.find(".listuserhead").text(data.name.substring(0,1)).addClass("online");
                        list.attr("value",data.id);
                        list.attr("onclick","getuserdata(this.value);");
                        list.find(".listusername").text(data.name);
                        list.find(".listusernewss").text("[个性签名]"+data.describe);
                        list.prependTo("#PHPChatlistbox2 .listbody");
                    }
                });
            }
            
        	// list.find(".listuserhead").removeClass("noline").addClass("online");
            // $("#PHPChatlistbox1 .listbody li").first().after(list);

        }else if(data.command == "102"){
        	//好友下线
            var list = $("#PHPChatlistbox1 .listbody li[value='" + data.user_id + "']");
        	list.find(".listuserhead").removeClass("online").addClass("noline");
            $("#PHPChatlistbox1 .listbody li").last().after(list);
            var list = $("#PHPChatlistbox2 .listbody li[value='" + data.user_id + "']");
            list.remove();

        }else if(data.command == "103"){
        	//私聊消息
			var list;
            if(data.goal_id == ChatIDP){
                if(data.status == 1){
                    list = ChatNewsR.clone(true).appendTo("#ChatUsernews");
                    list.find(".Rlistnews").text(data.content);
                    list.find(".Rlisthead").text(data.name.substring(0,1));
                    list.find(".Rlistname").text(data.name);
                    scroll(200);
                }else if (data.status == 0){
                    list = ChatNewsL.clone(true).appendTo("#ChatUsernews");
                    list.find(".Llistnews").text(data.content);
                    list.find(".Llisthead").text(data.name.substring(0,1));
                    list.find(".Llistname").text(data.name);
                    scroll(200);
                }
                //消除红点
                $.ajax({
                    type: "POST",
                    url: "index.php/message/gchat/setMsgStatus",
                    data: "glist_id=" + ChatIDP.toString().substring(1),
                    success: function(data){
                        // console.log(data);
                    }
                });
            }else{
                list = $("#ChatWin .ChatUserlist li[value='" + data.goal_id + "']").find(".listnewsnum");
                list.text(parseInt(list.text()) + 1);
                list.show();
                list = $("#PHPChatlistbox1 .listbody li[value='" + data.goal_id + "']").find(".listnewsnum");
                list.text(parseInt(list.text()) + 1);
                list.show();
            }
            $("#ChatWin .ChatUserlist li[value='" + data.goal_id + "']").find(".listusernews").text(data.content);
            $("#PHPChatlistbox1 .listbody li[value='" + data.goal_id + "']").find(".listusernews").text(data.content);
            $("#PHPChatlistbox1 .listbody li[value='" + data.goal_id + "']").find(".listnewsdate").text(data.last_time);
        }else if(data.command == "104"){
        	//群聊消息
            if("G" + data.id == ChatIDP){
                if(data.user_id == ChatID){
                    list = ChatNewsR.clone(true).appendTo("#ChatUsernews");
                    list.find(".Rlistnews").text(data.content);
                    list.find(".Rlisthead").text(data.name.substring(0,1));
                    list.find(".Rlistname").text(data.name);
                    scroll(200);
                }else{
                    list = ChatNewsL.clone(true).appendTo("#ChatUsernews");
                    list.find(".Llistnews").text(data.content);
                    list.find(".Llisthead").text(data.name.substring(0,1));
                    list.find(".Llistname").text(data.name);
                    scroll(200);
                }
                //消除红点
                $.ajax({
                    type: "POST",
                    url: "index.php/message/gchat/setMsgStatus",
                    data: "goal_id=" + ChatIDP,
                    success: function(data){
                        // console.log(data);
                    }
                });
            }else{
                list = $("#ChatWin .ChatUserlist li[value='G" + data.id + "']").find(".listnewsnum");
                list.text(parseInt(list.text()) + 1);
                list.show();
            }
            $("#ChatWin .ChatUserlist li[value='G" + data.id + "']").find(".listusernews").text(data.content);
        }else if(data.command == "105"){
            //心跳 放着
        }else if(data.command == "106"){
            //好友请求
            var list;
            if(data.goal_id == ChatIDP){
                if(data.status == 1){
                    // list = ChatNewsR.clone(true).appendTo("#ChatUsernews");
                    // list.find(".Rlistnews").text(data.content);
                    // list.find(".Rlisthead").text(data.name.substring(0,1));
                    // list.find(".Rlistname").text(data.name);
                    // scroll(200);
                    console.log("如果遇到特殊问题了，我也不知道");
                }else if (data.status == 0){
                    list = ChatNewsL.clone(true).appendTo("#ChatUsernews");
                    list.find(".Llistnews").html(Notice(data.title,data,data.type));
                    list.find(".Llisthead").text(data.name.substring(0,1));
                    list.find(".Llistname").text(data.name);
                    scroll(200);
                }
                //消除红点
                $.ajax({
                    type: "POST",
                    url: "index.php/message/pchat/setMsgStatus",
                    data: "goal_id=" + ChatIDP,
                    success: function(data){
                        // console.log(data);
                    }
                });
            }else{
                list = $("#ChatWin .ChatUserlist li[value='" + data.goal_id + "']").find(".listnewsnum");
                list.text(parseInt(list.text()) + 1);
                list.show();
                list = $("#PHPChatlistbox1 .listbody li[value='" + data.goal_id + "']").find(".listnewsnum");
                list.text(parseInt(list.text()) + 1);
                list.show();
            }
            $("#ChatWin .ChatUserlist li[value='" + data.goal_id + "']").find(".listusernews").text(data.title);
            $("#PHPChatlistbox1 .listbody li[value='" + data.goal_id + "']").find(".listusernews").text(data.title);
            $("#PHPChatlistbox1 .listbody li[value='" + data.goal_id + "']").find(".listnewsdate").text(data.last_time);
        }else if(data.command == "107"){
            //同意好友请求
            var time = timedeal(data.last_time);
            var list = $("#PHPChatlistbox1 .listbody li").first().clone(true).appendTo("#PHPChatlistbox1 .listbody");
            list.attr("value",data.id);
            list.find(".listuserhead").text(data.name.substring(0,1));
            var str = $("#PHPChatlistbox1 .listhead span").text();
            var num = parseInt(str.substring(str.indexOf("(")+1,str.indexOf("/")));
            var sum = parseInt(str.substring(str.indexOf("/")+1,str.indexOf(")"))) + 1;
            if(data.status == 2){
                list.find(".listuserhead").addClass("online");
                num++;
                $("#PHPChatlistbox1 .listhead span").text("我的好友("+num+"/"+sum+")");
            }else if(data.status == 1){
                list.find(".listuserhead").addClass("noline");
                $("#PHPChatlistbox1 .listhead span").text("我的好友("+num+"/"+sum+")");
            }
            list.find(".listusername").text(data.name);
            if(data.count > 0)list.find(".listnewsnum").text(data.count).show();
            else list.find(".listnewsnum").text(data.count).hide();
            list.find(".listusernews").text(data.last_msg);
            list.find(".listnewsdate").text(time);
            $("#PHPChatlistbox1 .listbody li").first().after(list);
        }else if(data.command == "108"){
            //拒绝好友请求
            var list;
            if(ChatIDP == 1){
                list = ChatNewsL.clone(true).appendTo("#ChatUsernews");
                //改
                list.find(".Llistnews").html(Notice(data.title,data,data.type));
                list.find(".Llisthead").text(data.from_user.substring(0,1));
                list.find(".Llistname").text(data.from_user);
                scroll(200);
                //消除红点
                $.ajax({
                    type: "POST",
                    url: "index.php/message/pchat/setMsgStatus",
                    data: "goal_id=" + ChatIDP,
                    success: function(data){
                        // console.log(data);
                    }
                });
            }else{
                list = $("#ChatWin .ChatUserlist li[value='" + data.id + "']").find(".listnewsnum");
                list.text(parseInt(list.text()) + 1);
                list.show();
                list = $("#PHPChatlistbox1 .listbody li[value='" + data.id + "']").find(".listnewsnum");
                list.text(parseInt(list.text()) + 1);
                list.show();
            }
            $("#ChatWin .ChatUserlist li[value='" + data.goal_id + "']").find(".listusernews").text(data.title);
            $("#PHPChatlistbox1 .listbody li[value='" + data.goal_id + "']").find(".listusernews").text(data.title);
            $("#PHPChatlistbox1 .listbody li[value='" + data.goal_id + "']").find(".listnewsdate").text(timedeal(data.last_time));
        }
    };
    Websocket.onclose = function()
    {
        console.log("连接关闭");
    };
}
function getUserInfo(userId){
    var userdata;
    $.ajax({
        type: "POST",
        url: "index.php/user/message/get",
        data: "user_id=" + userId,
        async:false,
        success: function(data){
            userdata = data;
        }
    });
    return userdata;
}
function getuserdata(id){
    if(id == 0){
        var data = getUserInfo(id);
        $("#UserInfoWin .userBox .userhead").text(data.name.substring(0,1));
        $("#UserInfoWin .userBox .usersign").text(data.describe);
        $("#UserInfoWin .userBox .usernum").text(data.name);
        $("#UserInfoWin .userBox .sex").text(data.sex);
        $("#UserInfoWin .usereditBox #Ename").val(data.name);
        $("#UserInfoWin .usereditBox #Esex").val(data.sex);
        $("#UserInfoWin .usereditBox #Esign").val(data.describe);
        $("#UserInfoWin .userBox .editBox button").attr("onclick","edit(1);").find("img").attr("src","./src/edit.svg");
        $("#UserInfoWin .userBox .editBox button").show();
        $("#UserInfoWin").show();
    }else{
        var data = getUserInfo(id);
        $("#UserInfoWin .userBox .userhead").text(data.name.substring(0,1));
        $("#UserInfoWin .userBox .usersign").text(data.describe);
        $("#UserInfoWin .userBox .usernum").text(data.name);
        $("#UserInfoWin .userBox .sex").text(data.sex);
        if(data.status == 1)$("#UserInfoWin .userBox .editBox button").attr("onclick","FriendDel("+id+")").find("img").attr("src","./src/DelFriend.svg");
        else if(data.status == 0)$("#UserInfoWin .userBox .editBox button").attr("onclick","FriendAdd("+id+")").find("img").attr("src","./src/AddFriend.svg");
        if(id == 1)$("#UserInfoWin .userBox .editBox button").hide();
        else $("#UserInfoWin .userBox .editBox button").show();
        $("#UserInfoWin").show();
    }
    
}
function setUserInfo(){
    if(Ename.value != "" && Esex.value != ""){
         $.ajax({
            type: "POST",
            url: "index.php/user/message/set",
            data: "name="+Ename.value+"&sex="+Esex.value+"&describe="+Esign.value,
            async:false,
            success: function(data){
                if(data.result == 1){
                    $("#UserInfoWin .userBox .userhead").text(Ename.value.substring(0,1));
                    $("#UserInfoWin .userBox .usersign").text(Esign.value);
                    $("#UserInfoWin .userBox .usernum").text(Ename.value);
                    $("#UserInfoWin .userBox .sex").text(Esex.value);
                    $("#PHPChatUserHead").text(Ename.value.substring(0,1));
                    $("#PHPChatUserSign").text(Esign.value);
                    $("#PHPChatUserName").text(Ename.value);
                    edit(0);
                }
            }
        });
    }
}
function getFriendList(){
    $.ajax({
        type: "POST",
        url: "index.php/user/friendlist/get",
        data: "",
        async:false,
        success: function(data){
            console.log(data);
            var listdata = "";
            var date = new Date();
            var onlineNum = 0;
            var list = $("#PHPChatlistbox1 .listbody li").first().clone(true);
            $("#PHPChatlistbox1 .listbody li").remove();
            for(var i = 0;i < data.length; i++){
                var time = timedeal(data[i].last_time);
                var list = list.clone(true).appendTo("#PHPChatlistbox1 .listbody");
                list.attr("value",data[i].id);
                list.find(".listuserhead").text(data[i].name.substring(0,1));
                if(data[i].status == 2){
                	list.find(".listuserhead").removeClass("noline");
                    list.find(".listuserhead").addClass("online");
                    onlineNum++;
                }else if(data[i].status == 1){
                	list.find(".listuserhead").removeClass("online");
                	list.find(".listuserhead").addClass("noline");
                }
                list.find(".listusername").text(data[i].name);

                if(data[i].count > 0)list.find(".listnewsnum").text(data[i].count);
                else list.find(".listnewsnum").hide();
                list.find(".listusernews").text(data[i].last_msg);
                list.find(".listnewsdate").text(time);
            }
            $("#PHPChatlistbox1 .listhead span").text("我的好友 (" + onlineNum + "/" + data.length + ")");
        }
    });
}
function getOnlineList(){
    $.ajax({
        type: "POST",
        url: "index.php/user/online/get",
        data: "",
        async:false,
        success: function(data){
            var num = data.length;
            $("#PHPChatlistbox2 .listhead span").text("大厅在线("+num+")");
            var list;
            for(var i = 0;i < data.length;i++){
                list = ChatOnlinelist.clone(true);
                list.find(".listuserhead").text(data[i].name.substring(0,1)).addClass("online");
                list.attr("value",data[i].id);
                list.attr("onclick","getuserdata(this.value);");
                list.find(".listusername").text(data[i].name);
                list.find(".listusernewss").text("[个性签名]"+data[i].describe);
                list.appendTo("#PHPChatlistbox2 .listbody");
            }
        }
    });
}
function Chat(id){
    if(id != ChatIDP){
        $("#Input").val("");
        if(id == 1)$("#Input").attr("disabled",true);
        else $("#Input").attr("disabled",false); 
        ChatIDP = id;
        $.ajax({
            type:"GET",
            url:"index.php/message/pchat/getMsg",
            data:"goal_id="+id+"&msg_id=0",
            success:function(data){
                console.log(data);
                data.msg = JSON.parse(data.msg);
                $("#PHPChatlistbox1 .listbody li[value='" + id + "']").find(".listnewsnum").hide().text(0);
                var list = $("#ChatWin .ChatUserlist li[value='" + id + "']");
                if(list.length == 0){
                    if($("#ChatWin .ChatUserlist li").length > 0){
                        $("#ChatWin .ChatUserlist").show();
                    }
                    list = ChatUser.clone(true).appendTo("#ChatWin .ChatUserlist");
                    list.find(".listuserhead").text(data.friend_name.substring(0,1));
                    list.find(".listusername").text(data.friend_name);
                    if(data.msg.length>0 && data.msg[0].title == undefined)list.find(".listusernews").text(data.msg[0].content);
                    else if(data.msg.length>0 && data.msg[0].title != undefined)list.find(".listusernews").text(data.msg[0].title);
                    else list.find(".listusernews").text("暂无通知");
                    list.attr("value",id);
                    data.id = id;
                    // ChatData.unshift(data);
                }
                $("#ChatWin #Userhead").text(data.friend_name.substring(0,1));
                $("#ChatWin #Username").text(data.friend_name);
                var date = new Date();
                $("#ChatUsernews li").remove();
                for(var i = 0;i < data.msg.length;i++){
                	// var year  = data.msg[i].create_time.substring(0,4);
                	// var month = data.msg[i].create_time.substring(5,7);
                	// var day   = data.msg[i].create_time.substring(8,10);
                	// if(year == date.getFullYear()){
                 //    	if(month == date.getMonth() + 1){
                 //        	if(day == date.getDate()){
                 //        		var hour = data.msg[i].create_time.substring(11,13);
                 //        		var time  = data.msg[i].create_time.substring(14,16);
                 //        		if(hour == date.getHours()){
                 //        			if(time <= date.getMinutes() - 3)Chathint(hour+":"+time);
                 //        		}else Chathint(hour+":"+time);
                 //        	}else Chathint(year+"-"+month+"-"+day);
                 //        }else Chathint(year+"-"+month+"-"+day);
                	// }else Chathint(year+"-"+month+"-"+day);
                	Chatnews(data.friend_name,data.msg[i],data.msg[i].status,data.msg[i].type);
                }
                if(data.msg.length >= 10)Chathint("<a class='noselect shou' onclick='history(this)'>查看历史消息</a>");
                Selected(list);
                scroll(200);
            }
        });
    }
    $("#ChatWin").show();
    $("#PHPChatSearchlist").hide();
    $("#PHPChatSearch").val("");
    $("#PHPChatSearchlist li").remove();
    ChatSearchHint.clone(true).appendTo("#PHPChatSearchlist");
}
function GChat(id){
    if("G" + id != ChatIDP){
        $("#Input").val("");
        $("#Input").attr("disabled",false); 
        ChatIDP = "G" + id;
        $.ajax({
            type:"GET",
            url:"index.php/message/gchat/getMsg",
            data:"glist_id="+id,
            success:function(data){
                data.msg = JSON.parse(data.msg);
                console.log(data);
                // $("#PHPChatlistbox1 .listbody li[value='G" + id + "']").find(".listnewsnum").hide().text(0);
                var list = $("#ChatWin .ChatUserlist li[value='G" + id + "']");
                if(list.length == 0){
                    if($("#ChatWin .ChatUserlist li").length > 0){
                        $("#ChatWin .ChatUserlist").show();
                    }
                    list = ChatUser.clone(true).appendTo("#ChatWin .ChatUserlist");
                    list.find(".listuserhead").text(data.name.substring(0,1));
                    list.find(".listusername").text(data.name);
                    if(data.msg.length>0 && data.msg[0].title == undefined)list.find(".listusernews").text(data.msg[0].content);
                    else if(data.msg.length>0 && data.msg[0].title != undefined)list.find(".listusernews").text(data.msg[0].title);
                    else list.find(".listusernews").text("暂无通知");
                    list.attr("value","G"+id);
                    data.id = id;
                    // ChatData.unshift(data);
                }
                $("#ChatWin #Userhead").text(data.name.substring(0,1));
                $("#ChatWin #Username").text(data.name);
                var date = new Date();
                $("#ChatUsernews li").remove();
                
                for(var i = 0;i < data.msg.length;i++){
                	// var year  = data.msg[i].create_time.substring(0,4);
                	// var month = data.msg[i].create_time.substring(5,7);
                	// var day   = data.msg[i].create_time.substring(8,10);
                	// if(year == date.getFullYear()){
                 //    	if(month == date.getMonth() + 1){
                 //        	if(day == date.getDate()){
                 //        		var hour = data.msg[i].create_time.substring(11,13);
                 //        		var time  = data.msg[i].create_time.substring(14,16);
                 //        		if(hour == date.getHours()){
                 //        			if(time <= date.getMinutes() - 3)Chathint(hour+":"+time);
                 //        		}else Chathint(hour+":"+time);
                 //        	}else Chathint(year+"-"+month+"-"+day);
                 //        }else Chathint(year+"-"+month+"-"+day);
                	// }else Chathint(year+"-"+month+"-"+day);
                	Chatnews(data.msg[i].name,data.msg[i],data.msg[i].status,data.msg[i].type);
                }
                if(data.msg.length >= 10)Chathint("<a class='noselect shou' onclick='history(this)'>查看历史消息</a>");
                ChatGnewID = data.msg[i-1].id;
                Selected(list);
                scroll(200);
            }
        });
    }
    $("#ChatWin").show();
    $("#PHPChatSearchlist").hide();
    $("#PHPChatSearch").val("");
    $("#PHPChatSearchlist li").remove();
    ChatSearchHint.clone(true).appendTo("#PHPChatSearchlist");
}
function history(dom){
    $(dom).parent().parent().remove();
    $("#ChatUsernews").scrollTop(2);
    if(ChatIDP.toString().substring(0,1) == "G"){
        $.ajax({
            type:"GET",
            url:"index.php/message/gchat/getMsg",
            data:"glist_id="+ChatIDP.toString().substring(1)+"&msg_id=" + ChatGnewID,
            success:function(data){
                data.msg = JSON.parse(data.msg);
                for(var i = 0;i < data.msg.length; i++){
                    Chatnews(data.name,data.msg[i],data.msg[i].status,data.msg[i].type);
                }
                if(data.msg.length >= 10)Chathint("<a class='noselect shou' onclick='history(this)'>查看历史消息</a>");
                ChatGnewID = data.msg[i-1].id;
            }
        });
    }else{
        $.ajax({
            type:"GET",
            url:"index.php/message/pchat/getMsg",
            data:"goal_id="+ChatIDP,
            success:function(data){
                data.msg = JSON.parse(data.msg);
                for(var i = 0;i < data.msg.length; i++){
                    Chatnews(data.friend_name,data.msg[i],data.msg[i].status,data.msg[i].type);
                }
                if(data.msg.length >= 10)Chathint("<a class='noselect shou' onclick='history(this)'>查看历史消息</a>");
            }
        });
    }
}
function Search(ch){
    if(ChatPage == 1){
        $.ajax({
            type:"GET",
            url:"index.php/user/friendlist/search",
            data:"search="+ch,
            success:function(data){
                var list;
                $("#PHPChatSearchlist").children().remove();
                if(data.length > 0){
                    for (var i = 0; i < data.length; i++) {
                        list = ChatSearchResult.clone(true);
                        list.attr("value",data[i].id);
                        list.find(".listuserhead").text(data[i].name.substring(0,1));
                        if(data[i].status == 2)list.find(".listuserhead").removeClass("noline").addClass("online");
                        else if(data[i].status == 1 || data[i].status == 3)list.find(".listuserhead").removeClass("online").addClass("noline");
                        list.find(".listusername").text(data[i].name);
                        list.find(".listusernews").text(data[i].account);
                        list.appendTo("#PHPChatSearchlist");
                    }
                }else{
                    list = ChatSearchHint.clone(true);
                    list.appendTo("#PHPChatSearchlist");
                }
                
            }
        });
    }else if(ChatPage == 2){
        $.ajax({
            type:"GET",
            url:"index.php/user/online/search",
            data:"search="+ch,
            success:function(data){
                var list;
                $("#PHPChatSearchlist").children().remove();
                if(data.length > 0){
                    for (var i = 0; i < data.length; i++) {
                        list = ChatSearchResult.clone(true);
                        list.attr("onclick","getuserdata(this.value)");
                        list.attr("value",data[i].id);
                        list.find(".listuserhead").text(data[i].name.substring(0,1));
                        if(data[i].status == 2)list.find(".listuserhead").removeClass("noline").addClass("online");
                        else if(data[i].status == 1 || data[i].status == 3)list.find(".listuserhead").removeClass("online").addClass("noline");
                        list.find(".listusername").text(data[i].name);
                        list.find(".listusernews").text(data[i].account);
                        list.appendTo("#PHPChatSearchlist");
                    }
                }else{
                    list = ChatSearchHint.clone(true);
                    list.appendTo("#PHPChatSearchlist");
                }
            }
        });
    }
}
function Send(news){
	if(news != ""){
        if(ChatIDP.toString().substring(0,1) == "G"){
            $.ajax({
                type:"POST",
                url:"index.php/message/gchat/send",
                data:"glist_id="+ChatIDP.substring(1)+"&content="+news,
                success:function(data){
                    if(data.result == 1){
                        
                    }
                }
            });
        }
        else{
            $.ajax({
                type:"POST",
                url:"index.php/message/pchat/send",
                data:"goal_id="+ChatIDP+"&content="+news,
                success:function(data){
                    if(data.result == 1){
                        
                    }
                }
            });
        }
	}
}
function FriendAdd(id){
    $.ajax({
        type:"POST",
        url:"index.php/user/friendlist/add",
        data:"friend_id="+id,
        success:function(data){
            console.log(data);
        }
    });
}
function FriendDel(id){
    $.ajax({
        type:"POST",
        url:"index.php/user/friendlist/del",
        data:"friend_id="+id,
        success:function(data){
            console.log(data);
        }
    });
}
function FriendAgree(dom,id){
    $.ajax({
        type:"POST",
        url:"index.php/user/friendlist/agree",
        data:"friend_id="+id,
        success:function(data){
            if(data.result == 1){
                $(dom).parent().html("<div class='newsTrue'>已同意</div>");
            }
        }
    });
}
function FriendRefuse(dom,id){
    $.ajax({
        type:"POST",
        url:"index.php/user/friendlist/refuse",
        data:"friend_id="+id,
        success:function(data){
            if(data.result == 1){
                $(dom).parent().html("<div class='newsFalse'>已拒绝</div>");
            }
        }   
    });
}
function heartbeat(){
    if(ChatHeart == true){
        Websocket.send("1");
    }else{
        console.log("连接已断开");
    }
    
}
function test(){
	console.log(456879);
}