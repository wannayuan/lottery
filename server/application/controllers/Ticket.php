
<?php 
 header("Content-type:text/html;charset=utf-8");
//  error_reporting(0);
require APPPATH.'business/simple_html_dom.php';
  class Ticket extends CI_Controller{
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
function index(){
//实例化DOM对象
$html=new simple_html_dom();
//获取最新开奖信息公布页面的url地址
//中国福利彩票官网地址
$url="http://www.cwl.gov.cn";
$con=$this->curl_request($url);
$html=str_get_html($con);
$ul=$html->find(".mainnav ul",0);
$li=$ul->find("li",8);
$url=$li->find("a",0)->href;
$url="http://www.cwl.gov.cn/$url";
//获取最新开奖信息
$url=isset($_GET["url"])?$_GET["url"]:$url;
$con=$this->curl_request($url);
$html=str_get_html($con);
$arr=array();
$arr["information"]["redballs"]=[];
$arr["information"]["blueballs"]=[];
// foreach($html->find('div.drawright') as $div){
//     foreach($div->find(ul) as $k=>$ul){
//         $arr[$k]['one']=$ul->find('li',0)->plaintext;
//         $arr[$k]['tow']=$ul->find('li',1)->plaintext;
//     }
// }
foreach ($html->find("div .drawright ul") as $key => $ul) {
  foreach ($ul->find("li") as $key => $li) {
    if($key==0){
     $arr["information"]["qihao"]=$li->find("span",0)->plaintext;
     $arr["information"]["kaijiang"]=$li->find("span",1)->plaintext;
     $arr["information"]["xiaoliang"]=$li->find("i",0)->plaintext;
     $arr["information"]["jiangchi"]=$li->find("i",1)->plaintext;
    }else if($key==1){
      foreach ($li->find("span") as $key => $span) { 
        if(!isset($span->class)){
          array_push($arr["information"]["redballs"],$span->plaintext);
        }else{
          array_push($arr["information"]["blueballs"],$span->plaintext);
        }
      }
    }
  }
  sort($arr["information"]["redballs"]);
  sort($arr["information"]["blueballs"]);
}
foreach($html->find('table.mt17') as $table){
    foreach($table->find(tr) as $k=>$tr){
    if($k>0){
     $arr["balls"][$k]['jiangji']=$tr->find('td',0)->plaintext;
     $arr["balls"][$k]['zhongjiangzhushu']=$tr->find('td',1)->plaintext;
     $arr["balls"][$k]['zhongjiangjine']=$tr->find('td',2)->plaintext;
    }
   }
}
$arr=json_encode($arr,JSON_UNESCAPED_UNICODE);
echo $arr;
  }
}