<?php
header("Content-type:text/html;charset=utf-8");
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Aloneshop extends CI_Controller {
  function index(){
    $betnumber=$_GET['betnumber'];//是一个包含多个号码和注数的字符串
    $lotterytype=$_GET['lotterytype'];
    $username=$_GET['username'];
    $openid=$_GET['openid'];
    $multiple=$_GET['multiple'];
    $lotterystation=$_GET['lotterystation'];
    $copies=$_GET['copies'];
    $issue=$_GET['issue'];
    $zhuijia=$_GET['zhuijia'];
    $arr=explode("|",$betnumber);
    var_dump($arr);
    foreach($arr as $value){
      $temp=explode("#",$value);
      $totalmoney=$temp[1]*$multiple;
      DB::insert('shop',['betnumber'=>$temp[0],'lotterytype'=>$lotterytype,'username'=>$username,'openid'=>$openid,'issue'=>$issue,'lotterystation'=>$lotterystation,'multiple'=>$multiple,'copies'=>$copies,'zhuijia'=>$zhuijia,'totalmoney'=>$totalmoney]);
    }
  }
}
