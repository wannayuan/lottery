<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Updateimage extends CI_Controller{
    public function index() {
      //更新出票状态
     $id=$_GET['id'];
     $imgUrl=$_GET['imgUrl'];
     echo $id;
     DB::update('shop',['chustatus'=>'true','imgUrl'=>$imgUrl],['id'=>$id]); 
     echo "更新成功";
    }
}
