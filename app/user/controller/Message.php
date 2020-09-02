<?php
namespace app\user\controller;
use app\model\User;
use think\Db;

class Message{
    //获取用户信息  post    user_id
    public function get(){
        $user_id = session('user_id');
        $goal_id = input("post.user_id",0);
        $goal_id = $goal_id ? $goal_id : $user_id;
        if(!$goal_id)
            return ['result'=>'0','code'=>'006'];
        $member = Db::table('flist')->where(['user_id'=>$user_id,'status'=>1])->field('member')->find()['member'].'0';
        $sql = "SELECT id,name,sex,`describe`,(SELECT IF(($goal_id IN ($member) OR $goal_id=1),1,0)) AS status
                FROM user
                WHERE id=$goal_id";
        $res = Db::query($sql);
        return count($res)>0?$res[0]:(object)['result'=>"0"];
    }
    //修改用户信息  post    user_id     name    sex     describe
    public function set(){
        $user_id = session('user_id');
        if(!$user_id)
            return ['result'=>'0','code'=>'003'];
        $res = User::where(['id'=>$user_id,'status'=>2])
            ->find();
        $res->name = input('post.name');
        $res->sex = input('post.sex');
        $res->describe = input('post.describe');
        $res->save();
        return ['result'=>'1'];
    }
}