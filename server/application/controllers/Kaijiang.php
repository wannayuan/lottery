
<?php 
 header("Content-type:text/html;charset=utf-8");
//  error_reporting(0);
require APPPATH.'business/simple_html_dom.php';
  class Kaijiang extends CI_Controller {
   function curl_request($url,$post='',$cookie='', $returnCookie=0){
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)');
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl, CURLOPT_AUTOREFERER, 1);
        curl_setopt($curl, CURLOPT_REFERER, "http://XXX");
        if($post) {
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($post));
        }
        if($cookie) {
            curl_setopt($curl, CURLOPT_COOKIE, $cookie);
        }
        curl_setopt($curl, CURLOPT_HEADER, $returnCookie);
        curl_setopt($curl, CURLOPT_TIMEOUT, 10);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $data = curl_exec($curl);
        if (curl_errno($curl)) {
            return curl_error($curl);
        }
        curl_close($curl);
        if($returnCookie){
            list($header, $body) = explode("\r\n\r\n", $data, 2);
            preg_match_all("/Set\-Cookie:([^;]*);/", $header, $matches);
            $info['cookie']  = substr($matches[1][0], 1);
            $info['content'] = $body;
            return $info;
        }else{
            return $data;
        }
}
function daletou(){
    //实例化DOM对象
$html=new simple_html_dom();
//初始化保存开奖新的数组
$arr=array();
//获取最新开奖信息公布页面的url地址
$url="http://www.lottery.gov.cn/";
$con=$this->curl_request($url);
$html=str_get_html($con);
$table=$html->find(".b11_06 table",0);
$daletouTR=$table->find("tr",1);
$daletouTD=$daletouTR->find("td",4);
$daletouURL=$daletouTD->find("a",0)->href;
//往期大乐透历史开奖信息的url地址
$daletouURL="http://www.lottery.gov.cn$daletouURL";
$qixingcaiTR=$table->find("tr",4);
$qixingcaiTD=$qixingcaiTR->find("td",4);
$qixingcaiURL=$qixingcaiTD->find("a",0)->href;
$qixingcaiURL="http://www.lottery.gov.cn$qixingcaiURL";
$con=$this->curl_request($daletouURL);
$html=str_get_html($con);
//获取大乐透历史开奖详情
//开奖table
$table=$html->find(".result table",0);
foreach ($table->find("tr") as $kTR => $tr) {
  if($kTR>1){
    $arr["daletou"]["tr$kTR"]["redballs"]=[];
    $arr["daletou"]["tr$kTR"]["blueballs"]=[];
    $arr["daletou"]["tr$kTR"]["qihao"]=$tr->find("td",0)->plaintext;
    $redballs=$tr->find(".red");
    $blueballs=$tr->find(".blue");
    foreach ($redballs as $key => $red) {
      array_push($arr["daletou"]["tr$kTR"]["redballs"],$red->plaintext);
    }
    foreach ($blueballs as $key => $blue) {
      array_push($arr["daletou"]["tr$kTR"]["blueballs"],$blue->plaintext);
    }
    $arr["daletou"]["tr$kTR"]["url"]=$tr->find("td",16)->find("a",0)->href;
    $arr["daletou"]["tr$kTR"]["xiaoliang"]=$tr->find("td",17)->plaintext;
    $arr["daletou"]["tr$kTR"]["jiangchi"]=$tr->find("td",18)->plaintext;
    $arr["daletou"]["tr$kTR"]["kaijiangTime"]=$tr->find("td",19)->plaintext;
    sort($arr["daletou"]["tr$kTR"]["redballs"]);
    sort($arr["daletou"]["tr$kTR"]["blueballs"]);
  }
}
//获取七星彩的历史开奖详情
$con=$this->curl_request($qixingcaiURL);
$html=str_get_html($con);
$table=$html->find(".result table",0);
foreach ($table->find("tr") as $key => $tr) {
  if($key>1){
    $arr["qixingcai"]["tr$key"]["balls"]=[];
    $arr["qixingcai"]["tr$key"]["qihao"]=$tr->find("td",0)->plaintext;
    $ball1=substr($tr->find("td",1)->plaintext,0,1);
    $ball2=substr($tr->find("td",1)->plaintext,1,1);
    $ball3=substr($tr->find("td",1)->plaintext,2,1);
    $ball4=substr($tr->find("td",1)->plaintext,3,1);
    $ball5=substr($tr->find("td",1)->plaintext,4,1);
    $ball6=substr($tr->find("td",1)->plaintext,5,1);
    $ball7=substr($tr->find("td",1)->plaintext,6,1);
    array_push($arr["qixingcai"]["tr$key"]["balls"],$ball1,$ball2,$ball3,$ball4,$ball5,$ball6,$ball7);
    $arr["qixingcai"]["tr$key"]["prize"]["yidengjiang"]["jiangji"]="一等奖";
    $arr["qixingcai"]["tr$key"]["prize"]["yidengjiang"]["zhongjiangzhushu"]=$tr->find("td",2)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["yidengjiang"]["zhongjiangjine"]=$tr->find("td",3)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["erdengjiang"]["jiangji"]="二等奖";
    $arr["qixingcai"]["tr$key"]["prize"]["erdengjiang"]["zhongjiangzhushu"]=$tr->find("td",4)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["erdengjiang"]["zhongjiangjine"]=$tr->find("td",5)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["sandengjiang"]["jiangji"]="三等奖";
    $arr["qixingcai"]["tr$key"]["prize"]["sandengjiang"]["zhongjiangzhushu"]=$tr->find("td",6)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["sandengjiang"]["zhongjiangjine"]=$tr->find("td",7)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["sidengjiang"]["jiangji"]="四等奖";
    $arr["qixingcai"]["tr$key"]["prize"]["sidengjiang"]["zhongjiangzhushu"]=$tr->find("td",8)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["sidengjiang"]["zhongjiangjine"]=$tr->find("td",9)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["wudengjiang"]["jiangji"]="五等奖";
    $arr["qixingcai"]["tr$key"]["prize"]["wudengjiang"]["zhongjiangzhushu"]=$tr->find("td",10)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["wudengjiang"]["zhongjiangjine"]=$tr->find("td",11)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["liudengjiang"]["jiangji"]="六等奖";
    $arr["qixingcai"]["tr$key"]["prize"]["liudengjiang"]["zhongjiangzhushu"]=$tr->find("td",12)->plaintext;
    $arr["qixingcai"]["tr$key"]["prize"]["liudengjiang"]["zhongjiangjine"]=$tr->find("td",13)->plaintext;
    $arr["qixingcai"]["tr$key"]["url"]=$tr->find("td",14)->find("a",0)->href;
    $arr["qixingcai"]["tr$key"]["xiaoliang"]=$tr->find("td",15)->plaintext;
    $arr["qixingcai"]["tr$key"]["jiangchi"]=$tr->find("td",16)->plaintext;
    $arr["qixingcai"]["tr$key"]["kaijiangTime"]=$tr->find("td",17)->plaintext;
  }
}
//获取双色球历史开奖信息
$shuangurl="http://zst.aicai.com/ssq/openInfo/";
$con=$this->curl_request($shuangurl);
$html=str_get_html($con);
//历史开奖信息所在的table元素
$table=$html->find("div .mainTab_lskj table",0);
//循环table中的每个tr行
foreach($table->find("tr") as $kTR => $tr){
   //历史开奖信息从第三行开始
  if($kTR>1){
    $arr["shuangseqiu"]["tr$kTR"]["redballs"]=[];
    $arr["shuangseqiu"]["tr$kTR"]["blueballs"]=[];
    $arr["shuangseqiu"]["tr$kTR"]["qihao"]=$tr->find("td",0)->plaintext;
    $arr["shuangseqiu"]["tr$kTR"]["kaijiangTime"]=$tr->find("td",1)->plaintext;
    $redballs=$tr->find("td.redColor");
    $blueballs=$tr->find("td.blueColor");
    foreach ($redballs as $key => $red) {
      if($key<(count($redballs)-1)){
      array_push($arr["shuangseqiu"]["tr$kTR"]["redballs"],$red->plaintext);
      }
    }
    foreach ($blueballs as $key => $blue) {
      array_push($arr["shuangseqiu"]["tr$kTR"]["blueballs"],$blue->plaintext);
    }
    $arr["shuangseqiu"]["tr$kTR"]["xiaoliang"]=$tr->find("td",9)->plaintext;
    $arr["shuangseqiu"]["tr$kTR"]["jiangchi"]=$tr->find("td",14)->plaintext;
    $arr["shuangseqiu"]["tr$kTR"]["prize"]["yidengjiang"]["jiangji"]="一等奖";
    $arr["shuangseqiu"]["tr$kTR"]["prize"]["yidengjiang"]["zhongjiangzhushu"]=$tr->find("td",10)->plaintext;
    $arr["shuangseqiu"]["tr$kTR"]["prize"]["yidengjiang"]["zhongjiangjine"]=$tr->find("td",11)->plaintext;
    $arr["shuangseqiu"]["tr$kTR"]["jiangchi"]=$tr->find("td",14)->plaintext;
    $arr["shuangseqiu"]["tr$kTR"]["prize"]["erdengjiang"]["jiangji"]="二等奖";
    $arr["shuangseqiu"]["tr$kTR"]["prize"]["erdengjiang"]["zhongjiangzhushu"]=$tr->find("td",12)->plaintext;
    $arr["shuangseqiu"]["tr$kTR"]["prize"]["erdengjiang"]["zhongjiangjine"]=$tr->find("td",13)->plaintext;
  }
  }

$arr=json_encode($arr,JSON_UNESCAPED_UNICODE);
echo $arr;
}
}