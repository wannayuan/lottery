<?php
  //获取大乐透的合买信息
  use QCloud_WeApp_SDK\Mysql\Mysql as DB;
  class Daletouhemai extends CI_Controller {
    function index(){
     $temp=[];
     $rows=DB::select('hemai',['*'],['lotterytype'=>'大乐透','finishstate'=>'false']); 
     $arr=json_decode(json_encode($rows),'true');
      foreach($arr as $k=>$value){
         $percent=round(($value['copies']-$value['lastcopies'])/$value['copies']*100,2);
         $temp[$k]=$arr[$k];
         $temp[$k]['percent']=$percent;
       }

     $temp=json_encode($temp,JSON_UNESCAPED_UNICODE);
     echo $temp;
    }
  }