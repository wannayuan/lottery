<?php
  //获取指定用户全部订单信息
  error_reporting(0);
  use QCloud_WeApp_SDK\Mysql\Mysql as DB;
  class Chupiao extends CI_Controller {
    function index(){
     $openid=$_GET['openid'];
     $prizestate=$_GET['prizeState'];
     $station=DB::row('lotterystation',['name'],['openid'=>$openid]);
     $station=json_decode(json_encode($station),'true');
     $lottery=$station['name'];
     if($prizestate==1){
     $rows=DB::select('shop',['betnumber','id','imgUrl'],['lotterystation'=>$lottery,'finishstate'=>'true','chustatus'=>'false']);  //未出票
     }else if($prizestate==2){
     $rows=DB::select('shop',['betnumber','id','imgUrl'],['lotterystation'=>$lottery,'finishstate'=>'true','chustatus'=>'true']); //已出票
     }
     $temp=json_decode(json_encode($rows),'true');
     foreach($temp as $k=>$value){
       $temp[$k]['state']=1;
     }
     $arr=json_encode($temp,JSON_UNESCAPED_UNICODE);
     echo $arr;
    }
  }
