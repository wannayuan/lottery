<?php
//获取用户权限和账户信息
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Account extends CI_Controller {
  function index(){
  $openid=$_GET['openid'];
  $rows=DB::row('account',['*'],['openid'=>$openid]);
  $rows=json_decode(json_encode($rows),'ture');
  $arr['quanxian']=$rows['quanxian'];
  $arr['account']=array_diff($rows,$arr);
  $arr=json_encode($arr,JSON_UNESCAPED_UNICODE);
  echo $arr;
  }
}
