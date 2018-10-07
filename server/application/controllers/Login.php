<?php
defined('BASEPATH') OR exit('No direct script access allowed');
//php命名空间的使用
use QCloud_WeApp_SDK\Auth\LoginService as LoginService; //会话服务
use QCloud_WeApp_SDK\Constants as Constants; // 

class Login extends CI_Controller {
    // public function index(){
    //    $result = LoginService::login(); //处理用户登录，返回一个数组
    //    $arr=json_encode($rows,JSON_UNESCAPED_UNICODE);
    //    echo $arr;
    //     if ($result['loginState'] === Constants::S_AUTH) {
    //         $this->json([
    //             'code' => 0,  //登录成功
    //             'data' => $result['userinfo'] //用户信息
    //         ]);
    //     } else {
    //         $this->json([
    //             'code' => -1,  //登录失败
    //             'error' => $result['error'] //返回错误信息
    //         ]);
    //     }
    // }
    public function index(){
      $code=trim($_GET['code']);
      $appid='wx4362f44fb0b39bd9';
      $secret='7a25c1a75de6459eb95724887be374e3';
     //向第三方服务器发送请求获取openid
      $url="https://api.weixin.qq.com/sns/jscode2session?js_code=$code&appid=$appid&secret=$secret&grant_type=authorization_code";
      //初始化一个 cURL 对象 
      $ch  = curl_init();
      //设置你需要抓取的URL
      curl_setopt($ch, CURLOPT_URL, $url);
      // 设置cURL 参数，要求结果保存到字符串中还是输出到屏幕上。
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      //是否获得跳转后的页面
      curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
      $data = curl_exec($ch);
      curl_close($ch);
      echo $data;
    }
}
