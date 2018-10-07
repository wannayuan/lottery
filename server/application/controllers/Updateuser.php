<?php
//更新用户个人资料
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Updateuser extends CI_Controller {
  function index(){
  $realname=$_GET['realname'];
  $telphone=$_GET['telphone'];
  $IDcard=$_GET['IDcard'];
  $openid=$_GET['openid'];
  DB::update("user",['realname'=>$realname,'telphone'=>$telphone,'IDcard'=>$IDcard],['openid'=>$openid]);
  }
}