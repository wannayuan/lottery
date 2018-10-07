<?php
//获取账户余额，判断是否可以购买 可以购买 更新账户金额并返回true 否则 返回false
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Signin extends CI_Controller {
  function index(){
   $username=$_GET['username'];
   $password=$_GET['password'];
   $rows=DB::row('user',['password','openid'],['nickname'=>$username]);
   $rows=json_decode(json_encode($rows),'true');
   if(count($rows)>0){
     if($password==$rows['password']){
       $array['login']='true';
       $array['openid']=$rows['openid'];
       $arr=json_encode($array,JSON_UNESCAPED_UNICODE);
       echo $arr;
     }else{
       echo  "false";
     }
   }else{
    $rows=DB::row('user',['password','openid'],['telphone'=>$username]);
    $rows=json_decode(json_encode($rows),'true');
    if(count($rows)>0){
       if($password==$rows['password']){
        $array['login']='true';
        $array['openid']=$rows['openid'];
        $arr=json_encode($array,JSON_UNESCAPED_UNICODE);
        echo $arr;
     }else{
       echo  "false";
     }
    }
   }
  }
}