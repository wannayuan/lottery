<?php
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Fhemai extends CI_Controller{
  function index(){
    $betnumber=$_GET['betnumber'];
    $lotterytype=$_GET['lotterytype'];
    $username=$_GET['username'];
    $openid=$_GET['openid'];
    $multiple=$_GET['multiple'];
    $lotterystation=$_GET['lotterystation'];
    $copies=$_GET['copies'];
    $issue=$_GET['issue'];
    $zhuijia=$_GET['zhuijia'];
    $baodicopies=$_GET['baodicopies'];
    $arr=explode("|",$betnumber);
    foreach($arr as $value){
      $temp=explode("#",$value);
      $totalmoney=$temp[1]*$multiple;
      DB::insert('hemai',['betnumber'=>$temp[0],'lotterytype'=>$lotterytype,'username'=>$username,'openid'=>$openid,'issue'=>$issue,'lotterystation'=>$lotterystation,'multiple'=>$multiple,'copies'=>$copies,'zhuijia'=>$zhuijia,'baodicopies'=>$baodicopies,'lastcopies'=>$copies,'totalmoney'=>$totalmoney]);
    }
  }
}
