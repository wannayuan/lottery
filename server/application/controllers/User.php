<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class User extends CI_Controller {
    public function index() {
      //user表中必填字段 昵称  openid
      $nickname=$_GET['nickName']; 
      $openid=$_GET['openid'];  
        // $result = LoginService::check();

        // if ($result['loginState'] === Constants::S_AUTH) {
        //     $this->json([
        //         'code' => 0,
        //         'data' => $result['userinfo']
        //     ]);
        // } else {
        //     $this->json([
        //         'code' => -1,
        //         'data' => []
        //     ]);
        // }
      //在user表创建一条新用户信息
    DB::insert('user',['nickname'=>$nickname,'openid'=>$openid]);
    DB::insert('account',['totalmoney'=>0,'usemoney'=>0,'dongjiemoney'=>0,'openid'=>$openid]);
    $rows=DB::row('user',['*'],['openid'=>$openid]);//查询单条数据
    $rows=json_decode(json_encode($rows),'true');
    $arr['login']=$rows['openid'];
    $arr['information']=array_diff($rows,$arr);
    $arr=json_encode($arr,JSON_UNESCAPED_UNICODE);
    echo $arr;
    }
}
