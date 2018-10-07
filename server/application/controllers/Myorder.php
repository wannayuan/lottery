<?php
  //获取指定用户全部订单信息
  error_reporting(0);
  use QCloud_WeApp_SDK\Mysql\Mysql as DB;
  class Myorder extends CI_Controller {
    function index(){
     $openid=$_GET['openid'];
     $prizestate=$_GET['prizeState'];
     if($prizestate==1){
     $rows=DB::select('shop',['betnumber','issue','Pid','username','lotterytype'],['openid'=>$openid]);  //默认全部订单
     }else if($prizestate==2){
     $rows=DB::select('shop',['betnumber','issue','Pid','username','lotterytype'],['openid'=>$openid,'prizestate'=>'true','kaistate'=>'true','finishstate'=>'true']);  //中奖
     }else if($prizestate==3){
     $rows=DB::select('shop',['betnumber','issue','Pid','username','lotterytype'],['openid'=>$openid,'kaistate'=>'false','finishstate'=>'true']); //待开奖
     }else if($prizestate==4){
     $rows=DB::select('shop',['betnumber','issue','Pid','username','lotterytype'],['openid'=>$openid,'finishstate'=>'false']); //未完成
     }
     $arr=json_decode(json_encode($rows),'true');
     foreach($arr as $k=>$value){
       if((integer)$value['Pid']==0){
         //单独买
         $arr[$k]['percent']=100;
         $arr[$k]['shoptype']='alone';
         $arr[$k]['select']=false;
       }else if((integer)$value['Pid']>0){
         //合买
         $arr[$k]['shoptype']='hemai';
         $arr[$k]['select']=false;
         $Pid=$value['Pid'];
         $result=DB::row('hemai',['copies','lastcopies'],['id'=>$Pid]);
         $result=json_decode(json_encode($result),'true');
         $arr[$k]['percent']=round((($result['copies']-$result['lastcopies'])/$result['copies'])*100,2);
       }
     }
     $arr=json_encode($arr,JSON_UNESCAPED_UNICODE);
     echo $arr;
    }
  }
