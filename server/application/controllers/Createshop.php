<?php
  //获取彩票站信息
  use QCloud_WeApp_SDK\Mysql\Mysql as DB;
  class Createshop extends CI_Controller {
    function index(){
     $bianhao=$_GET['bianhao'];
     $name=$_GET['name'];
     $openid=$_GET['openid'];
     $address=$_GET['openid'];
     $telphone=$_GET['telphone'];
     $IDcard=$_GET['IDcard'];
     $imgUrl=$_GET['imgUrl'];
     DB::insert('lotterystation',['bianhao'=>$bianhao,'name'=>$name,'openid'=>$openid,'address'=>$address,'telphone'=>$telphone,'IDcard'=>$IDcard,'imgUrl'=>$imgUrl]);   
     DB::update('account',['quanxian'=>'caipiaozhan'],['openid'=>$openid]);
     DB::update('user',['quanxian'=>'caipiaozhan'],['openid'=>$openid]);
     DB::update('applyShop',['status'=>'true'],['openid'=>$openid]);
    }
  }
