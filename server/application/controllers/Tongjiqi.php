
<?php 
header("Content-type:text/html;charset=utf-8");
   error_reporting(0);
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
class Tongjiqi extends CI_Controller {
public function index(){

  $type=$_GET['type'];
  $qihao=$_GET['qihao'];
  $hemaiMo=0;
  $hemaiZhu=0;
  $danduMo=0;
  $danduZhu=0;
  $sanMo=0;
  $sanZhu=0;
  $siMo=0;
  $siZhu=0;
  $wuMo=0;
  $wuZhu=0;
  $liuMo=0;
  $liuZhu=0;
  $result=[];
  // $redString=$_GET['redString'];
  // $blueString=$_GET['blueString'];
  //从购买表中获取大乐透已完成，已出票，已开奖的订单
  //总销量和注数由单独买和合买两部分组成
  $rows=DB::select("shop",['*'],['lotterytype'=>$type,'issue'=>$qihao,'finishstate'=>true,'kaistate'=>true,'chustatus'=>true]);
  $arr=json_decode(json_encode($rows),'true');
  if(count($arr)>0){
   foreach($arr as $k=>$value){
     if($value['Pid']==0){
    //非合买
    $danduMo+=$value['totalmoney'];
    $danduZhu+=$value['totalmoney']/($value['multiple']*2);
    //中奖
    if($value['prizestate']=='true'){
     $prize=$value['prize'];
     if($prize==3){
     $sanMo+=$value['totalmoney'];
     $sanZhu+=$value['totalmoney']/($value['multiple']*2);
     }else if($prize==4){
     $siMo+=$value['totalmoney'];
     $siZhu+=$value['totalmoney']/($value['multiple']*2);
     }else if($prize==5){
     $wuMo+=$value['totalmoney'];
     $wuZhu+=$value['totalmoney']/($value['multiple']*2);
     }else if($prize==6){
     $liuMo+=$value['totalmoney'];
     $liuZhu+=$value['totalmoney']/($value['multiple']*2);
     }
    }
   }
  } 
 }
 //合买，从合买表中获取当期已完成的订单信息
 $rows=DB::select("hemai",['*'],['lotterytype'=>$type,'issue'=>$qihao,'finishstate'=>true,'kaistate'=>true]);
  $arr=json_decode(json_encode($rows),'true');
  if(count($arr)>0){
   foreach($arr as $k=>$value){
    //合买
    $hemaiMo+=$value['totalmoney'];
    $hemaiZhu+=$value['totalmoney']/($value['multiple']*2);
    //中奖
    if($value['prizestate']=='true'){
     $prize=$value['prize'];
     if($prize==3){
     $sanMo+=$value['totalmoney'];
     $sanZhu+=$value['totalmoney']/($value['multiple']*2);
     }else if($prize==4){
     $siMo+=$value['totalmoney'];
     $siZhu+=$value['totalmoney']/($value['multiple']*2);
     }else if($prize==5){
     $wuMo+=$value['totalmoney'];
     $wuZhu+=$value['totalmoney']/($value['multiple']*2);
     }else if($prize==6){
     $liuMo+=$value['totalmoney'];
     $liuZhu+=$value['totalmoney']/($value['multiple']*2);
     }
    }
  } 
 }
 $result['totalMo']=$danduMo+$hemaiMo;
 $result['totalZhu']=$danduZhu+$hemaiZhu;
 $result['hemaiMo']=$hemaiMo;
 $result['hemaiZhu']=$hemaiZhu;
 $result['sanMo']=$sanMo;
 $result['sanZhu']=$sanZhu;
 $result['siMo']=$siMo;
 $result['siZhu']=$siZhu;
 $result['wuMo']=$wuMo;
 $result['wuZhu']=$wuZhu;
 $result['liuMo']=$liuMo;
 $result['liuZhu']=$liuZhu;

 $temp['qixingcai'][0]=$result;
 $arr=json_encode($temp,JSON_UNESCAPED_UNICODE);
 echo $arr;
}
}