<?php
/**
 * Wafer php demo 配置文件
 */

$config = [
    'rootPath' => '',

    // 微信小程序 AppID
    'appId' => 'wx4362f44fb0b39bd9',

    // 微信小程序 AppSecret
    'appSecret' => '7a25c1a75de6459eb95724887be374e3',

    // 使用腾讯云代理登录
    'useQcloudLogin' => true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 AppID
     */
    'mysql' => [
        'host' => 'localhost',  //数据库主机名
        'port' => 3306,   //数据库端口号
        'user' => 'root',  //用户名
        'db'   => 'lotterySystem',  //数据库名称
        'pass' => 'wx4362f44fb0b39bd9',  //密码
        'char' => 'utf8mb4'   //编码
    ],

    'cos' => [
        /**
         * 区域
         * 上海：cn-east
         * 广州：cn-sorth
         * 北京：cn-north
         * 广州二区：cn-south-2
         * 成都：cn-southwest
         * 新加坡：sg
         * @see https://www.qcloud.com/document/product/436/6224
         */
        'region' => 'ap-guangzhou',
        // Bucket 名称
        'fileBucket' =>'lotterysystem-1254289170',
        // 文件夹
        'uploadFolder' => 'chupiao'
    ],

    // 微信登录态有效期
    'wxLoginExpires' => 7200,
    'wxMessageToken' => 'abcdefgh'
];
