<?php
//参与别人发起的合买
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Chemai extends CI_Controller {
  function index(){
    $betnumber=$_GET['betnumber'];
    $lotterytype=$_GET['lotterytype'];
    $username=$_GET['username'];
    $openid=$_GET['openid'];
    $multiple=$_GET['multiple'];
    $lotterystation=$_GET['lotterystation'];
    $shopcopies=$_GET['shopcopies'];
    $issue=$_GET['issue'];
    $zhuijia=$_GET['zhuijia'];
    $totalmoney=$_GET['totalmoney'];
    $Pid=$_GET['Pid'];
    $lastcopies=$_GET['lastcopies'];
    //更新合买表中的数据
    $lastcopies=$lastcopies-$shopcopies;
    if($lastcopies<=0){
       //购买表中和插入一条新数据
      DB::insert('shop',['betnumber'=>$betnumber,'lotterytype'=>$lotterytype,'username'=>$username,'openid'=>$openid,'issue'=>$issue,'lotterystation'=>$lotterystation,'multiple'=>$multiple,'copies'=>$shopcopies,'zhuijia'=>$zhuijia,'totalmoney'=>$totalmoney,'Pid'=>$Pid,'finishstate'=>'true']);
      DB::update('hemai',['lastcopies'=>0,'finishstate'=>'true'],['id'=>$Pid]);
      DB::update('shop',['finishstate'=>'true'],['Pid'=>$Pid]);
    }else{
       //购买表中和插入一条新数据
      DB::insert('shop',['betnumber'=>$betnumber,'lotterytype'=>$lotterytype,'username'=>$username,'openid'=>$openid,'issue'=>$issue,'lotterystation'=>$lotterystation,'multiple'=>$multiple,
    'copies'=>$shopcopies,'zhuijia'=>$zhuijia,'totalmoney'=>$totalmoney,'Pid'=>$Pid,'finishstate'=>'false']);
      DB::update('hemai',['lastcopies'=>$lastcopies,'finishstate'=>'false'],['id'=>$Pid]);
    }
  }
}