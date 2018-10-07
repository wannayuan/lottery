<?php
  //获取未处理的入驻申请
  use QCloud_WeApp_SDK\Mysql\Mysql as DB;
  class Manageapply extends CI_Controller{
    function index(){
     $rows=DB::select('applyShop',['realname','telphone','address','IDcard','openid'],['status'=>'false']); 
     $arr=json_encode($rows,JSON_UNESCAPED_UNICODE);
     echo $arr;
    }
  }