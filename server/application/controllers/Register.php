<?php
//获取账户余额，判断是否可以购买 可以购买 更新账户金额并返回true 否则 返回false
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Register extends CI_Controller {
  function index(){
   $openid=$_GET['openid'];
   $realname=$_GET['realname'];
   $nickname=$_GET['nickname'];
   $phonenumber=$_GET['phonenumber'];
   $IDcard=$_GET['IDcard'];
   $password=$_GET['password'];
   DB::insert('user',['nickname'=>$nickname,'realname'=>$realname,'telphone'=>$phonenumber,'IDcard'=>$IDcard,'password'=>$password,'openid'=>$openid]);
   DB::insert('account',['openid'=>$openid,'totalmoney'=>0,'dongjiemoney'=>0,'usemoney'=>0]);
   echo $openid;
  }
}
