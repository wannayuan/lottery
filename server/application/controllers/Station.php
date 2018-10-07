<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Station extends CI_Controller {
    public function index() {
     $rows=DB::select('lotterystation',['*']); 
     $arr=json_encode($rows,JSON_UNESCAPED_UNICODE);
     echo $arr;
    }
}