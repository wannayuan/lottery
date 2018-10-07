<?php
  //没有用户信息申请入驻
  use QCloud_WeApp_SDK\Mysql\Mysql as DB;
  class Applywait extends CI_Controller {
    function index(){
     $realname=$_GET['realname'];
     $telphone=$_GET['telphone'];
     $address=$_GET['address'];
     $IDcard=$_GET['IDcard'];
     $openid=$_GET['openid'];
     $nickname=$_GET['nickname'];
     //在user表中和account表中各创建一条新信息
     DB::insert('user',['realname'=>$realname,'nickname'=>$nickname,'telphone'=>$telphone,'IDcard'=>$IDcard,'openid'=>$openid]);
     DB::insert('account',['totalmoney'=>0,'dongjiemoney'=>0,'usemoney'=>0,'openid'=>$openid]);
     //在applyShop表中创建一条申请店铺信息
     DB::insert('applyShop',['realname'=>$realname,'nickname'=>$nickname,'address'=>$address,'telphone'=>$telphone,'IDcard'=>$IDcard,'openid'=>$openid]);
    }
  }