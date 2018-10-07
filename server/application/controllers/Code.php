<?php
/**
 * 发送模板短信
 * @author  chensheng
***/
//使用示例
error_reporting(0);
include_once APPPATH."controllers/ServerAPI.php";
class Code extends CI_Controller {
  function index(){
  $phone=$_GET['phone'];
 //网易云信分配的账号，请替换你在管理后台应用下申请的Appkey
 $AppKey = '5f6822de8afbd7ab71b9faf9dda6c1f9';
  //网易云信分配的账号，请替换你在管理后台应用下申请的appSecret
  $AppSecret='68dfb7f898c7';
  $p = new ServerAPI($AppKey,$AppSecret,'fsockopen');     //fsockopen伪造请求
  //发送短信验证码
  print_r($p->sendSmsCode('6272',$phone,'','6'));
  //发送模板短信
  // print_r( $p->sendSMSTemplate('6272',array('13888888888','13666666666'),array('xxxx','xxxx' )));
  }
}