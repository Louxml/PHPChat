<?php
namespace app\index\controller;
use GatewayClient\Gateway;

class Index{
    public function index(){
        $user_id = session("user_id");
        if($user_id)
            return ['result'=>'1','user_id'=>$user_id];
        return ['result'=>'0'];
    }
    public function test(){
        return Gateway::getAllUidList();
    }
}