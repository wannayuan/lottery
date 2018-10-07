<?php
//获取账户余额，判断是否可以购买 可以购买 更新账户金额并返回true 否则 返回false
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Shop extends CI_Controller {
  function index(){
   $openid=$_GET['openid'];
   $money=$_GET['money'];
   $rows=DB::row('account',['*'],['openid'=>$openid]);
   $rows=json_decode(json_encode($rows),'true');
   $usemoney=(float)$rows['usemoney'];
   $dongjiemoney=(float)$rows['dongjiemoney'];
   if($money<$usemoney){
     $usemoney=$usemoney-$money;
     $dongjiemoney=$dongjiemoney+$money;
     DB::update('account',['usemoney'=>$usemoney,'dongjiemoney'=>$dongjiemoney],['openid'=>$openid]);
     echo true; 
   }else{
     echo false;
   }
  }
}
