<?php
namespace app\message\controller;
use GatewayClient\Gateway;
use think\Db;

class Gchat{
    //发送群聊消息  post    id    content
    public function send(){
        $user_id = session("user_id");
        $user_id = $user_id?$user_id:input("post.user_id");
        if(!$user_id)
            return ['result'=>'0','code'=>'006'];
        $glist_id = input("post.glist_id");
        $content = input("post.content");
        if(!$content || !$glist_id)
            return ['result'=>'0','code'=>'004'];
        Db::table("gmessage")->insert(['user_id'=>$user_id,'glist_id'=>$glist_id,'content'=>$content]);
        $res['name'] = Db::table('user')->where("id",$user_id)->field("name")->find()['name'];
        $res['user_id'] = $user_id;
        $res['id'] = $glist_id;
        $res['content'] = $content;
        $res['last_time'] = date("Y-d-m H:i:s");
        $res['command'] = '104';
        $res['type'] = 0;
        Gateway::sendToGroup("chat",json_encode($res));
        return ['result'=>'1'];
    }
    //获取群聊消息  get    glist_id  msg_id
    public function getMsg(){
        $user_id = session("user_id");
        if(!$user_id)
            $user_id = input("get.user_id");
        if(!$user_id)
            return ['result'=>'0','code'=>'006'];
        $glist_id = input("get.glist_id");
        $msg_id = input("get.msg_id",0);
        if(!$glist_id || $msg_id === NULL)
            return ['result'=>'0','code'=>'004'];
        $sql = "SELECT id,name FROM glist WHERE id=$glist_id AND status=1";
        $res = Db::table('glist')->where(['id'=>$glist_id,'status'=>1])->field("id,name")->find();
        $sql = "SELECT id,content,(SELECT name FROM user WHERE id=gmessage.user_id) AS name,create_time AS last_time,0 AS type,
                    (IF(user_id=$user_id,1,0)) AS status
                FROM gmessage 
                WHERE glist_id=$glist_id AND status=1 AND (id<$msg_id OR $msg_id=0)
                ORDER BY update_time DESC
                LIMIT 0,10";
        $res['msg'] = Db::query($sql);
        if($res['msg'])
            Db::table("glist_member")->where(["user_id"=>$user_id,"glist_id"=>$glist_id])->update(['gmessage_id'=>$res['msg'][0]['id']]);
        $res['msg'] = json_encode($res["msg"]);
        return $res;
    }
    //重置消息状态  post  glist_id
    public function setMsgStatus(){
        $user_id = session("user_id");
        if(!$user_id)
            return ['result'=>'0','code'=>'006'];
        $glist_id = input("post.glist_id");
        if(!$glist_id)
            return ['result'=>'0','code'=>'004'];
        $msg_id = Db::table("gmessage")->where(['glist_id'=>$glist_id])->field("id")->order("id DESC")->find()['id'];
        Db::table("glist_member")->where(["user_id"=>$user_id,"glist_id"=>$glist_id])->update(['gmessage_id'=>$msg_id]);
        return ['result'=>1];
    }
}