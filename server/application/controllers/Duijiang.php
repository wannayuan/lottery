<?php
  //获取彩票站信息
  header("Content-type:text/html;charset=utf-8");
  use QCloud_WeApp_SDK\Mysql\Mysql as DB;
  class Duijiang extends CI_Controller {

    //双色球
    function shuangseqiu(){

    $type=(string)trim($_GET["type"]);
    $qihao=(string)trim($_GET["qihao"]);
    $redballs=(string)trim($_GET["redballs"]);
    $blueballs=(string)trim($_GET["blueballs"]);
    //开奖号码
    $redballs1=explode(",",$redballs);
    $blueballs1=explode(",",$blueballs);
    $prize=0;
    $prizestate='false';
    $money=0;
    $temp=[];
    //双色球的固定奖金为3单注等奖3000元，四等奖：200元，五等奖：10元，六等奖：5元
    //三等奖 投注号码与当期开奖号码中的6个红色号码相同
    //四等奖 投注号码与当期开奖号码中的任意5个红色号码相同，或与4个任意红色号码和1个蓝色号码相同
    //五等奖 投注号码与当期开奖号码中的任意4个红色号码相同，或与3个任意红色号码和1个蓝色号码相同
    //六等奖 投注号码与当期开奖号码中的蓝色号码相同
   
   //hemai表
  //1.查找出hemai表中 lotterytype=type,issue=qihao,finishsate=true, kaistate=false ,更新kaistate=true
  //2.每个 当期已完成的合买订单 在shop表中查找出来
  //3. 更新kaistate=true 判断是否中奖  更新prizestate ,prize
  //4. 为中奖的用户更新账户余额
   $rows=DB::select('hemai',['id','multiple','copies','betnumber','totalmoney'],['lotterytype'=>$type,'issue'=>$qihao,'finishstate'=>'true','kaistate'=>'false']);
   $arr=json_decode(json_encode($rows),'true');
   foreach($arr as $key=>$value){
     //发起合买的份数
      $copies=$value['copies'];
     //发起合买的号码
     $betnumber=$value['betnumber'];
     $balls=explode("-",$betnumber);
     //红球
     $red=explode(",",$balls[0]);
     //蓝球
     $blue=explode(",",$balls[1]);
     $zhushu=$value['totalmoney']/2;
     //开奖号码与发起合买的号码的交集 
     $intersectRed=array_intersect($red, $redballs1);
     $intersectBlue=array_intersect($blue, $blueballs1);
     if(count($intersectRed)==6&&count($intersectBlue)==1){
     //一等奖
     $prize=1;
     $prizestate="true";
     }else if(count($intersectRed)==6){
     //二等奖
     $prize=2;
     $prizestate="true";
     }else if(count($intersectRed)==5&&count($intersectBlue)==1){
     //三等奖
     $prize=3;
     $prizestate="true";
     $money=$zhushu*3000;
     }else if(count($intersectRed)==5||count($intersectRed)==4&&count($intersectBlue)==1){
     //四等奖
     $prize=4;
     $money=$zhushu*200;
     $prizestate="true";
     }else if(count($intersectRed)==4||count($intersectRed)==3&&count($intersectBlue)==1){
    //五等奖
      $prize=5;
      $money=$zhushu*10;
      $prizestate="true";
     }else if(count($intersectBlue)==1){
     //六等奖
      $prize=6;
      $money=$zhushu*5;
      $prizestate="true";
     }else{
       //没有中奖
       $prize=0;
       $prizestate="false";
     }
     DB::update('shop',['kaistate'=>'true','prizestate'=>$prizestate,'prize'=>$prize],['Pid'=>$value['id']]);
     //在shop表中查询Pid等于该合买订单的id的订单
     if($prize>3){
     $shop=DB::select('shop',['id','copies','openid'],['Pid'=>$value['id']]);
     $result=json_decode(json_encode($shop),'true');
     foreach($result as $k=>$v){
    //计算参与合买的每个订单的中奖金额
     $jiangjin=round(($v['copies']/$copies),2)*$money;
     $account=DB::select('account',['*'],['openid'=>$v['openid']]);
     $account=json_decode(json_encode($account),'true');
     $totalmoney=$account[0]['totalmoney']+$jiangjin;
     $usemoney=$account[0]['usemoney']+$jiangjin;
     DB::update('account',['totalmoney'=>$totalmoney,'usemoney'=>$usemoney],['id'=>$account[0]['id']]);
     $user=DB::select('user',['nickname'],['openid'=>$v['openid']]);
     $user=json_decode(json_encode($user),'true');
     $temp["hemai"][$k]['type']=$type;
     $temp["hemai"][$k]['prizeMoney']=$jiangjin;
     $temp["hemai"][$k]['prizedengji']=$prize;
     $temp["hemai"][$k]['username']=$user[0]['nickname'];
     $temp["hemai"][$k]['betnumber']=$betnumber;
    }
   }
   DB::update('hemai',['kaistate'=>'true','prizestate'=>$prizestate,'prize'=>$prize],['id'=>$value['id']]);
  }
    //1.更新购买表中 彩种=type,期号=qihao的订单的开奖状态
     $rows=DB::select('shop',['*'],['lotterytype'=>$type,'issue'=>$qihao,'finishstate'=>'true','kaistate'=>'false','Pid'=>0,'chustatus'=>'true']);
   $arr=json_decode(json_encode($rows),'true');
   foreach($arr as $key=>$value){
     //购买的倍数
      $multiple=$value['multiple'];
     //发起合买的号码
     $betnumber=$value['betnumber'];
     $balls=explode("-",$betnumber);
     //红球
     $red=explode(",",$balls[0]);
     //蓝球
     $blue=explode(",",$balls[1]);
     $zhushu=$value['totalmoney']/($value['multiple']*2);
     //开奖号码与发起合买的号码的交集 
     $intersectRed=array_intersect($red, $redballs1);
     $intersectBlue=array_intersect($blue, $blueballs1);
     if(count($intersectRed)==6&&count($intersectBlue)==1){
     //一等奖
     $prize=1;
     $prizestate="true";
     }else if(count($intersectRed)==6){
     //二等奖
     $prize=2;
     $prizestate="true";
     }else if(count($intersectRed)==5&&count($intersectBlue)==1){
     //三等奖
     $prize=3;
     $prizestate="true";
     $money=$zhushu*3000*$multiple;
     }else if(count($intersectRed)==5||count($intersectRed)==4&&count($intersectBlue)==1){
     //四等奖
     $prize=4;
     $money=$zhushu*200*$multiple;
     $prizestate="true";
     }else if(count($intersectRed)==4||count($intersectRed)==3&&count($intersectBlue)==1){
    //五等奖
      $prize=5;
      $money=$zhushu*10*$multiple;
      $prizestate="true";
     }else if(count($intersectBlue)==1){
     //六等奖
      $prize=6;
      $money=$zhushu*5*$multiple;
      $prizestate="true";
     }else{
       //没有中奖
       $prize=0;
       $prizestate="false";
     }
     DB::update('shop',['kaistate'=>'true','prizestate'=>$prizestate,'prize'=>$prize],['id'=>$value['id']]);
     if($prize>3){
     $account=DB::select('account',['*'],['openid'=>$value['openid']]);
     $account=json_decode(json_encode($account),'true');
     $totalmoney=$account[0]['totalmoney']+$money;
     $usemoney=$account[0]['usemoney']+$money;
     DB::update('account',['totalmoney'=>$totalmoney,'usemoney'=>$usemoney],['id'=>$account[0]['id']]);
     $user=DB::select('user',['nickname'],['openid'=>$value['openid']]);
     $user=json_decode(json_encode($user),'true');
     $temp["shop"][$key]['type']=$type;
     $temp["shop"][$key]['prizeMoney']=$money;
     $temp["shop"][$key]['prizedengji']=$prize;
     $temp["shop"][$key]['username']=$user[0]['nickname'];
     $temp["shop"][$key]['betnumber']=$betnumber;
     }
   }
     $temp=json_encode($temp,JSON_UNESCAPED_UNICODE);
     echo $temp;

    }

   //大乐透
     function daletou(){
    $type=(string)trim($_GET["type"]);
    $qihao=(string)trim($_GET["qihao"]);
    $redballs=(string)trim($_GET["redballs"]);
    $blueballs=(string)trim($_GET["blueballs"]);
    //开奖号码
    $redballs1=explode(",",$redballs);
    $blueballs1=explode(",",$blueballs);
    $prize=0;
    $prizestate='false';
    $money=0;
    $temp=[];
    //大乐透的固定奖金为四等奖：200元，五等奖：10元，六等奖：5元
    //一等奖 投注号码与当期开奖号码中的3个前区号码相同，或者任意1个前区号码及2个后区号码相同，或者任意2个前区号码及任意1个后区号码相同，或者2个后区号码相同，即中奖。
    //二等奖 投注号码与当期开奖号码中的5个前区号码及任意1个后区号码相同，即中奖；
    //三等奖 投注号码与当期开奖号码中的5个前区号码相同，或者任意4个前区号码及2个后区号码相同，即中奖；
    //四等奖 投注号码与当期开奖号码中的任意4个前区号码及任意1个后区号码相同，或者任意3个前区号码及2个后区号码相同，即中奖；200元
    //五等奖 投注号码与当期开奖号码中的任意4个前区号码相同，或者任意3个前区号码及1个后区号码相同，或者任意2个前区号码及2个后区号码相同，即中奖；10元
    //六等奖 投注号码与当期开奖号码中的3个前区号码相同，或者任意1个前区号码及2个后区号码相同，或者任意2个前区号码及任意1个后区号码相同，或者2个后区号码相同，即中奖。 5元
  //如追加投注中得固定奖，则追加投注奖金为当期基本投注对应单注奖金的50%。
   
   //hemai表
  //1.查找出hemai表中 lotterytype=type,issue=qihao,finishsate=true, kaistate=false ,更新kaistate=true
  //2.每个 当期已完成的合买订单 在shop表中查找出来
  //3. 更新kaistate=true 判断是否中奖  更新prizestate ,prize
  //4. 为中奖的用户更新账户余额
   $rows=DB::select('hemai',['id','multiple','copies','betnumber','totalmoney','zhuijia'],['lotterytype'=>$type,'issue'=>$qihao,'finishstate'=>'true','kaistate'=>'false']);
   $arr=json_decode(json_encode($rows),'true');
   foreach($arr as $key=>$value){
     echo "hemai";
     //发起合买的份数
      $copies=$value['copies'];
     //发起合买的号码
     $betnumber=$value['betnumber'];
     $balls=explode("-",$betnumber);
     //红球
     $red=explode(",",$balls[0]);
     //蓝球
     $blue=explode(",",$balls[1]);
     $zhushu=$value['totalmoney']/2;
     //开奖号码与发起合买的号码的交集 
     $intersectRed=array_intersect($red, $redballs1);
     $intersectBlue=array_intersect($blue, $blueballs1);
     print_r($intersectRed);
     print_r($intersectBlue);
     echo "blue";
     print_r($blue);
     echo "blueballs";
     print_r($blueballs1);
     if(count($intersectRed)==5&&count($intersectBlue)==2){
     //一等奖
     $prize=1;
     $prizestate="true";
     }else if(count($intersectRed)==5&&count($intersecBlue)==1){
     //二等奖
     $prize=2;
     $prizestate="true";
     }else if(count($intersectRed)==5||count($intersectRed)==4&&count($intersectBlue)==2){
     //三等奖
     $prize=3;
     $prizestate="true";
     }else if(count($intersectRed)==4&&count($intersectBlue)==1||count($intersectRed)==3&&count($intersectBlue)==2){
     //四等奖
     $prize=4;
     if($value['zhuijia']){
     $money=$zhushu*(200+200*0.5);
     }else{
     $money=$zhushu*200;
     }
     $prizestate="true";
     }else if(count($intersectRed)==4||count($intersectRed)==3&&count($intersectBlue)==1||count($intersectRed)==2&&count($intersectBlue)==2){
    //五等奖
     $prize=5;
     if($value['zhuijia']){
     $money=$zhushu*(10+10*0.5);
     }else{
     $money=$zhushu*10;
     }
      $prizestate="true";
     }else if(count($intersectRed)==3||count($intersectRed)==1&&count($intersectBlue)==2||count($intersectRed)==2&&count($intersectBlue)==1||count($intersectBlue)==2){
     //六等奖
      $prize=6;
      $money=$zhushu*5;
      $prizestate="true";
     }else{
       //没有中奖
       $prize=0;
       $prizestate="false";
     }
     DB::update('shop',['kaistate'=>'true','prizestate'=>$prizestate,'prize'=>$prize],['Pid'=>$value['id']]);
     //在shop表中查询Pid等于该合买订单的id的订单
     if($prize>3){
     $shop=DB::select('shop',['id','copies','openid'],['Pid'=>$value['id']]);
     $result=json_decode(json_encode($shop),'true');
     foreach($result as $k=>$v){
    //计算参与合买的每个订单的中奖金额
     $jiangjin=round(($v['copies']/$copies),2)*$money;
     $account=DB::select('account',['*'],['openid'=>$v['openid']]);
     $account=json_decode(json_encode($account),'true');
     $totalmoney=$account[0]['totalmoney']+$jiangjin;
     $usemoney=$account[0]['usemoney']+$jiangjin;
     DB::update('account',['totalmoney'=>$totalmoney,'usemoney'=>$usemoney],['id'=>$account[0]['id']]);
     $user=DB::select('user',['nickname'],['openid'=>$v['openid']]);
     $user=json_decode(json_encode($user),'true');
     $temp["hemai"][$k]['type']=$type;
     $temp["hemai"][$k]['prizeMoney']=$money;
     $temp["hemai"][$k]['prizedengji']=$prize;
     $temp["hemai"][$k]['username']=$user[0]['nickname'];
     $temp["hemai"][$k]['betnumber']=$betnumber;
    }
   }
   DB::update('hemai',['kaistate'=>'true','prizestate'=>$prizestate,'prize'=>$prize],['id'=>$value['id']]);
  }
    //1.更新购买表中 彩种=type,期号=qihao的订单的开奖状态
     $rows=DB::select('shop',['*'],['lotterytype'=>$type,'issue'=>$qihao,'finishstate'=>'true','kaistate'=>'false','Pid'=>0,'chustatus'=>'true']);
   $arr=json_decode(json_encode($rows),'true');
   foreach($arr as $key=>$value){
     echo "shop";
     //购买的倍数
      $multiple=$value['multiple'];
     //发起合买的号码
     $betnumber=$value['betnumber'];
     $balls=explode("-",$betnumber);
     //红球
     $red=explode(",",$balls[0]);
     //蓝球
     $blue=explode(",",$balls[1]);
     $zhushu=$value['totalmoney']/2;
     //开奖号码与发起合买的号码的交集 
     $intersectRed=array_intersect($red, $redballs1);
     $intersectBlue=array_intersect($blue, $blueballs1);
     if(count($intersectRed)==5&&count($intersectBlue)==2){
     //一等奖
     $prize=1;
     $prizestate="true";
     }else if(count($intersectRed)==5&&count($intersecBlue)==1){
     //二等奖
     $prize=2;
     $prizestate="true";
     }else if(count($intersectRed)==5||count($intersectRed)==4&&count($intersectBlue)==2){
     //三等奖
     $prize=3;
     $prizestate="true";
     }else if(count($intersectRed)==4&&count($intersectBlue)==1||count($intersectRed)==3&&count($intersectBlue)==2){
     //四等奖
     $prize=4;
     if($value['zhuijia']){
     $money=$zhushu*(200+200*0.5);
     }else{
     $money=$zhushu*200;
     }
     $prizestate="true";
     }else if(count($intersectRed)==4||count($intersectRed)==3&&count($intersectBlue)==1||count($intersectRed)==2&&count($intersectBlue)==2){
    //五等奖
     $prize=5;
     if($value['zhuijia']){
     $money=$zhushu*(10+10*0.5);
     }else{
     $money=$zhushu*10;
     }
      $prizestate="true";
     }else if(count($intersectRed)==3||count($intersectRed)==1&&count($intersectBlue)==2||count($intersectRed)==2&&count($intersectBlue)==1||count($intersectBlue)==2){
     //六等奖
      $prize=6;
      $money=$zhushu*5;
      $prizestate="true";
     }else{
       //没有中奖
       $prize=0;
       $prizestate="false";
     }
     DB::update('shop',['kaistate'=>'true','prizestate'=>$prizestate,'prize'=>$prize],['id'=>$value['id']]);
     if($prize>3){
     $account=DB::select('account',['*'],['openid'=>$value['openid']]);
     $account=json_decode(json_encode($account),'true');
     $totalmoney=$account[0]['totalmoney']+$money;
     $usemoney=$account[0]['usemoney']+$money;
     DB::update('account',['totalmoney'=>$totalmoney,'usemoney'=>$usemoney],['id'=>$account[0]['id']]);
     $user=DB::select('user',['nickname'],['openid'=>$value['openid']]);
     $user=json_decode(json_encode($user),'true');
     $temp["shop"][$key]['type']=$type;
     $temp["shop"][$key]['prizeMoney']=$money;
     $temp["shop"][$key]['prizedengji']=$prize;
     $temp["shop"][$key]['username']=$user[0]['nickname'];
     $temp["shop"][$key]['betnumber']=$betnumber;
     }
   }
     $temp=json_encode($temp,JSON_UNESCAPED_UNICODE);
     echo $temp;

    }


    //七星彩
    function qixingcai(){

    $type=(string)trim($_GET["type"]);
    $qihao=(string)trim($_GET["qihao"]);
    $balls=(string)trim($_GET["balls"]);
    //开奖号码
    $balls1=explode(",",$balls);
    $prize=0;
    $prizestate='false';
    $money=0;
    $temp=[];
    //七星彩的固定奖金为3单注等奖1800元，四等奖：300元，五等奖：20元，六等奖：5元
   // 一等奖：投注号码与开奖号码全部相符且排列一致，即中奖；
   // 二等奖：投注号码有连续6位号码与开奖号码相同位置的连续6位号码相同，即中奖；
  //三等奖：投注号码有连续5位号码与开奖号码相同位置的连续5位号码相同，即中奖；1800元
  //四等奖：投注号码有连续4位号码与开奖号码相同位置的连续4位号码相同，即中奖；300元
  //五等奖：投注号码有连续3位号码与开奖号码相同位置的连续3位号码相同，即中奖；20元

  //六等奖：投注号码有连续2位号码与开奖号码相同位置的连续2位号码相同，即中奖。5元
   
   //hemai表
  //1.查找出hemai表中 lotterytype=type,issue=qihao,finishsate=true, kaistate=false ,更新kaistate=true
  //2.每个 当期已完成的合买订单 在shop表中查找出来
  //3. 更新kaistate=true 判断是否中奖  更新prizestate ,prize
  //4. 为中奖的用户更新账户余额
   $rows=DB::select('hemai',['id','multiple','copies','betnumber','totalmoney'],['lotterytype'=>$type,'issue'=>$qihao,'finishstate'=>'true','kaistate'=>'false']);
   $arr=json_decode(json_encode($rows),'true');
   foreach($arr as $key=>$value){
     //发起合买的份数
      $copies=$value['copies'];
     //发起合买的号码
     $betnumber=$value['betnumber'];
     $balls=explode(",",$betnumber);
     foreach($balls as $kk=>$res){
       $newballs[$kk]=str_split($res);
     }
    //  print_r($newballs);
     $zhushu=$value['totalmoney']/2;
     $prizestate="false";
     $prize=0;
     $count=0;
     $maxcount=1;
     $maxprize=0;
     $money=0;
     $prizeMoney=0;
     $sign=0;  //标志位  0对应位没有匹配成功  1匹配成功
      //balls1是保存开奖号码的数组，是一维数组
      //balls是保存订单号码的数组,是二维数组
     foreach($balls1 as $index=>$res){
       if($sign==0){
         $count=0;
       } 
       foreach($newballs[$index] as $index1=>$res1){
         if($res==$res1){
          $count++;
          $sign=1; 
          break;
         }else{
           $sign=0;
         }
       }
      if($sign==1){
      if($count==2){
        $prizestate='true';
        $prize=6;
        $prizeMoney=5*$zhushu;
      }else if($count==3){
        $prizestate='true';
        $prize=5;
        $prizeMoney=20*$zhushu;
      }else if($count==4){
        $prizestate='true';
        $prize=4;
        $prizeMoney=300*$zhushu;
      }else if($count==5){
        $prizestate='true';
        $prize=3;
        $prizeMoney=1800*$zhushu;
      }else if($count==6){
        $prizestate='true';
        $prize=2;
      }else if($count==7){
        $prizestate='true';
        $prize=1;
      }
     if($count>$maxcount){
       $maxcount=$count;
       $maxprize=$prize;
       $money=$prizeMoney;
     }
      }
    }

     DB::update('shop',['kaistate'=>'true','prizestate'=>$prizestate,'prize'=>$maxprize],['Pid'=>$value['id']]);
     //在shop表中查询Pid等于该合买订单的id的订单
     if($maxprize>3){
     $shop=DB::select('shop',['id','copies','openid'],['Pid'=>$value['id']]);
     $result=json_decode(json_encode($shop),'true');
     foreach($result as $k=>$v){
    //计算参与合买的每个订单的中奖金额
     $jiangjin=round(($v['copies']/$copies),2)*$money;
     $account=DB::select('account',['*'],['openid'=>$v['openid']]);
     $account=json_decode(json_encode($account),'true');
     $totalmoney=$account[0]['totalmoney']+$jiangjin;
     $usemoney=$account[0]['usemoney']+$jiangjin;
     DB::update('account',['totalmoney'=>$totalmoney,'usemoney'=>$usemoney],['id'=>$account[0]['id']]);
     $user=DB::select('user',['nickname'],['openid'=>$v['openid']]);
     $user=json_decode(json_encode($user),'true');
     $temp["hemai"][$k]['type']=$type;
     $temp["hemai"][$k]['prizeMoney']=$jiangjin;
     $temp["hemai"][$k]['prizedengji']=$maxprize;
     $temp["hemai"][$k]['username']=$user[0]['nickname'];
     $temp["hemai"][$k]['betnumber']=$betnumber;
    }
   }
   DB::update('hemai',['kaistate'=>'true','prizestate'=>$prizestate,'prize'=>$maxprize],['id'=>$value['id']]);
  }
    //1.更新购买表中 彩种=type,期号=qihao的订单的开奖状态
     $rows=DB::select('shop',['*'],['lotterytype'=>$type,'issue'=>$qihao,'finishstate'=>'true','kaistate'=>'false','Pid'=>0,'chustatus'=>'true']);
   $arr=json_decode(json_encode($rows),'true');
   foreach($arr as $key=>$value){
     //购买的倍数
      $multiple=$value['multiple'];
     //发起合买的号码
     $betnumber=$value['betnumber'];
     $balls=explode(",",$betnumber);
     foreach($balls as $kk=>$res){
       $newballs[$kk]=str_split($res);
     }
     $zhushu=$value['totalmoney']/2;
     $prizestate="false";
     $prize=0;
     $maxprize=0;
     $count=0;
     $maxcount=1;
     $money=0;
     $prizeMoney=0;
     $sign=0;  //标志位  0对应位没有匹配成功  1匹配成功
      //balls1是保存开奖号码的数组，是一维数组
      //balls是保存订单号码的数组,是二维数组
     foreach($balls1 as $index=>$res){
       if($sign==0){
         $count=0;
       } 
       foreach($newballs[$index] as $index1=>$res1){
         if($res==$res1){
          $count++;
          $sign=1; 
          break;
         }else{
           $sign=0;
         }
       }
     if($sign==1){
      if($count==2){
        $prizestate='true';
        $prize=6;
        $prizeMoney=5*$zhushu;
      }else if($count==3){
        $prizestate='true';
        $prize=5;
        $prizeMoney=20*$zhushu;
      }else if($count==4){
        $prizestate='true';
        $prize=4;
        $prizeMoney=300*$zhushu;
      }else if($count==5){
        $prizestate='true';
        $prize=3;
        $prizeMoney=1800*$zhushu;
      }else if($count==6){
        $prizestate='true';
        $prize=2;
      }else if($count==7){
        $prizestate='true';
        $prize=1;
      }
      if($count>$maxcount){
        $maxcount=$count;
        $maxprize=$prize;
        $money=$prizeMoney;
      }
    }
            // echo "count: ".$count."------"."sign: ".$sign."---"."prize:".$prize;
     }
     DB::update('shop',['kaistate'=>'true','prizestate'=>$prizestate,'prize'=>$maxprize],['id'=>$value['id']]);
     if($maxprize>3){
     $account=DB::select('account',['*'],['openid'=>$value['openid']]);
     $account=json_decode(json_encode($account),'true');
     $totalmoney=$account[0]['totalmoney']+$money;
     $usemoney=$account[0]['usemoney']+$money;
     DB::update('account',['totalmoney'=>$totalmoney,'usemoney'=>$usemoney],['id'=>$account[0]['id']]);
     $user=DB::select('user',['nickname'],['openid'=>$value['openid']]);
     $user=json_decode(json_encode($user),'true');
     $temp["shop"][$key]['type']=$type;
     $temp["shop"][$key]['prizeMoney']=$money;
     $temp["shop"][$key]['prizedengji']=$maxprize;
     $temp["shop"][$key]['username']=$user[0]['nickname'];
     $temp["shop"][$key]['betnumber']=$betnumber;
     }
   }
     $temp=json_encode($temp,JSON_UNESCAPED_UNICODE);
     echo $temp;

    }

    //结束
  }
