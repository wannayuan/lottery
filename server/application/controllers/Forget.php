<?php
//更新用户个人资料
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Forget extends CI_Controller {
  function index(){
  $openid=$_GET['openid'];
  $password=$_GET['password'];
  $telphone=$_GET['telphone'];
  DB::update("user",['password'=>$password],['openid'=>$openid,'telphone'=>$telphone]);
  }
}