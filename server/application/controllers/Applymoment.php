<?php
  //已有用户信息申请入驻
  use QCloud_WeApp_SDK\Mysql\Mysql as DB;
  class Applymoment extends CI_Controller {
    function index(){
     $realname=$_GET['realname'];
     $telphone=$_GET['telphone'];
     $address=$_GET['address'];
     $IDcard=$_GET['IDcard'];
     $openid=$_GET['openid'];
     $nickname=$_GET['nickname'];
     DB::insert('applyShop',['realname'=>$realname,'nickname'=>$nickname,'address'=>$address,'telphone'=>$telphone,'IDcard'=>$IDcard,'openid'=>$openid]);
    }
  } 