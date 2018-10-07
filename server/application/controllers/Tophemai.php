<?php
  //获取双色球，大乐透，七星彩的最高合买完成率的投注号码
  use QCloud_WeApp_SDK\Mysql\Mysql as DB;
  class Tophemai extends CI_Controller {
    function index(){
     $temp=[];
     $rows=DB::select('hemai',['betnumber','issue','username','lotterytype','copies','lastcopies'],['lotterytype'=>'双色球','finishstate'=>'false']); 
     $arr=json_decode(json_encode($rows),'true');
     if(count($arr)>0){
       $max=0;
       $key=0;
      foreach($arr as $k=>$value){
         $percent=round((($value['copies']-$value['lastcopies'])/$value['copies'])*100,2);
         if($percent>=$max){
           $max=$percent;
           $key=0;
         }
       }
           $temp['双色球']=$arr[$key];
           $temp['双色球']['percent']=$max;
           $temp['双色球']['hemai']=true;
     }else{
       $temp['双色球']['hemai']=false;
       $temp['双色球']['lotterytype']='双色球';
     }
     //七星彩
     $rows=DB::select('hemai',['betnumber','issue','username','lotterytype','copies','lastcopies'],['lotterytype'=>'七星彩','finishstate'=>'false']); 
     $arr=json_decode(json_encode($rows),'true');
      if(count($arr)>0){
        $max=0; //保存最高完成率
        $key=0;
        foreach($arr as $k=>$value){
              //合买
           $percent=round((($value['copies']-$value['lastcopies'])/$value['copies'])*100,2);
              if($percent>=$max){
                $max=$percent;
                $key=$k;
              }
          }
          $temp['七星彩']=$arr[$key];
          $temp['七星彩']['percent']=$max;
          $temp['七星彩']['hemai']=true;
     }else{
          $temp['七星彩']['hemai']=false;
          $temp['七星彩']['lotterytype']='七星彩';
     }

   //大乐透
    $rows=DB::select('hemai',['betnumber','issue','username','lotterytype','copies','lastcopies'],['lotterytype'=>'大乐透','finishstate'=>'false']);  
     $arr=json_decode(json_encode($rows),'true');
     if(count($arr)>0){   
      $max=0; //保存最高完成率
      $key=0;       
      foreach($arr as $k=>$value){
         //合买
         $percent=round((($value['copies']-$value['lastcopies'])/$value['copies'])*100,2);
         if($percent>=$max){
           $max=$percent;
           $key=$k;
         }
     }
         $temp['大乐透']=$arr[$key];
         $temp['大乐透']['percent']=$max;
         $temp['大乐透']['hemai']=true;
     }else{
      $temp['大乐透']['hemai']=false;
      $temp['大乐透']['lotterytype']='大乐透';
     }

     $temp=json_encode($temp,JSON_UNESCAPED_UNICODE);
     echo $temp;
    }
  }