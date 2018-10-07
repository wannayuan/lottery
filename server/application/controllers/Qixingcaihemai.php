<?php
  //获取七星彩的合买信息
  use QCloud_WeApp_SDK\Mysql\Mysql as DB;
  class Qixingcaihemai extends CI_Controller {
    function index(){
     $temp=[];
     $rows=DB::select('hemai',['*'],['lotterytype'=>'七星彩','finishstate'=>'false']); 
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