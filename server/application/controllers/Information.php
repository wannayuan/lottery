<?php
//个人资料
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class information extends CI_Controller {
    public function index() {
    $realname=$_GET['realName'];
    $IDcard=$_GET['IDcard'];
    $telphone=$_GET['phoneNumber'];
    $openid=$_GET['openid'];
    DB::update('user',['realname'=>$realname,'IDcard'=>$IDcard,'telphone'=>$telphone],"openid=$openid");
    }
}
