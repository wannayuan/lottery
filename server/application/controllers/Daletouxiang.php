<?php
header("Content-type:text/html;charset=utf-8");
// error_reporting(0); 
require APPPATH.'business/simple_html_dom.php';
 class Daletouxiang extends CI_Controller {

  public function index(){
     echo "hello world";
  }

  //定义爬虫函数
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
//获取大乐透的开奖信息
public function daletou(){
 //实例化DOM对象
$html=new simple_html_dom();
$url=isset($_GET["url"])?trim($_GET["url"]):"";
$url="http://www.lottery.gov.cn$url";
$con=$this->curl_request($url);
$html=str_get_html($con);
$arr=array();
$table=$html->find(".k_list .k_04 table",0);
$arr["prize"]["yiJIBEN"]["jiangji"]="一等奖";
$arr["prize"]["yiJIBEN"]["zhongjiangzhushu"]=trim($table->find("tr",1)->find("td",2)->plaintext);
$arr["prize"]["yiJIBEN"]["zhongjiangjine"]=trim($table->find("tr",1)->find("td",3)->plaintext);
$arr["prize"]["erJIBEN"]["jiangji"]="二等奖";
$arr["prize"]["erJIBEN"]["zhongjiangzhushu"]=trim($table->find("tr",3)->find("td",2)->plaintext);
$arr["prize"]["erJIBEN"]["zhongjiangjine"]=trim($table->find("tr",3)->find("td",3)->plaintext);
$arr["prize"]["sanJIBEN"]["jiangji"]="三等奖";
$arr["prize"]["sanJIBEN"]["zhongjiangzhushu"]=trim($table->find("tr",5)->find("td",2)->plaintext);
$arr["prize"]["sanJIBEN"]["zhongjiangjine"]=trim($table->find("tr",5)->find("td",3)->plaintext);
$arr["prize"]["siJIBEN"]["jiangji"]="四等奖";
$arr["prize"]["siJIBEN"]["zhongjiangzhushu"]=trim($table->find("tr",7)->find("td",2)->plaintext);
$arr["prize"]["siJIBEN"]["zhongjiangjine"]=trim($table->find("tr",7)->find("td",3)->plaintext);
$arr["prize"]["wuJIBEN"]["jiangji"]="五等奖";
$arr["prize"]["wuJIBEN"]["zhongjiangzhushu"]=trim($table->find("tr",9)->find("td",2)->plaintext);
$arr["prize"]["wuJIBEN"]["zhongjiangjine"]=trim($table->find("tr",9)->find("td",3)->plaintext);
$arr["prize"]["liuJIBEN"]["jiangji"]="六等奖";
$arr["prize"]["liuJIBEN"]["zhongjiangzhushu"]=trim($table->find("tr",11)->find("td",1)->plaintext);
$arr["prize"]["liuJIBEN"]["zhongjiangjine"]=trim($table->find("tr",11)->find("td",2)->plaintext);
$arr["prize"]["yiZHUIJIA"]["jiangji"]="一等奖追加";
$arr["prize"]["yiZHUIJIA"]["zhongjiangzhushu"]=trim($table->find("tr",2)->find("td",1)->plaintext);
$arr["prize"]["yiZHUIJIA"]["zhongjiangjine"]=trim($table->find("tr",2)->find("td",2)->plaintext);
$arr["prize"]["erZHUIJIA"]["jiangji"]="二等奖追加";
$arr["prize"]["erZHUIJIA"]["zhongjiangzhushu"]=trim($table->find("tr",4)->find("td",1)->plaintext);
$arr["prize"]["erZHUIJIA"]["zhongjiangjine"]=trim($table->find("tr",4)->find("td",2)->plaintext);
$arr["prize"]["sanZHUIJIA"]["jiangji"]="三等奖追加";
$arr["prize"]["sanZHUIJIA"]["zhongjiangzhushu"]=trim($table->find("tr",6)->find("td",1)->plaintext);
$arr["prize"]["sanZHUIJIA"]["zhongjiangjine"]=trim($table->find("tr",6)->find("td",2)->plaintext);
$arr["prize"]["siZHUIJIA"]["jiangji"]="四等奖追加";
$arr["prize"]["siZHUIJIA"]["zhongjiangzhushu"]=trim($table->find("tr",8)->find("td",1)->plaintext);
$arr["prize"]["siZHUIJIA"]["zhongjiangjine"]=trim($table->find("tr",8)->find("td",2)->plaintext);
$arr["prize"]["wuZHUIJIA"]["jiangji"]="五等奖追加";
$arr["prize"]["wuZHUIJIA"]["zhongjiangzhushu"]=trim($table->find("tr",10)->find("td",1)->plaintext);
$arr["prize"]["wuZHUIJIA"]["zhongjiangjine"]=trim($table->find("tr",10)->find("td",2)->plaintext);
$arr=json_encode($arr,JSON_UNESCAPED_UNICODE);
echo $arr;
}

}