//获取应用实例
var app = getApp();
Page({
  data: {
    imgUrls: [
     {
      "src":"../../images/lunbo1.png",
      "type":"qixingcai",
     },
     {
       "src":"../../images/lunbo1.jpg",
       "type":"daletou",
     
     },
     {
       "src":"../../images/lunbo2.jpg",
       "type":"shuangseqiu",
     },
    ],
    "indivatorDots": "true",
    "autoplay": "true",
    "interval": 6000,
    "duration": 1000,
    "circular": "true",
    "vertical": "true",
    "shuangKaiJiang":"false",//双色球是否开奖，周二，周四，周日开奖
    "daletouKaiJiang":"false", //大乐透是否开奖，周一，周三，周六开奖
    "qixingcaiKaiJiang":"false", //七星彩是否开奖，周二，周五，周日开奖
    "jingKaiJiang":"false", //竞彩足球是否开奖，根据比赛日程安排
    "fucaiKaiJiang":"false", //福彩3D是否开奖，每天开奖一次
     //中奖滚动条的信息
    "person":[
    {
      "username":'wanna',
      'type':"双色球",
      "prizeMoney":12800,
      "prize":'一等奖'
    },
    {
      "username":"晴天",
      "type":"七星彩",
      "prizeMoney":18000,
      "prize":"一等奖"
    },
    {
      "username":"下雨",
      "type":"大乐透",
      "prizeMoney":24000,
      "prize":"二等奖"
    }
    ], 
  },
  onShow: function () {
    var that=this;
    app.globalData.zhuijia = false;
    var zhongjiang=wx.getStorageSync('gonggao');
    var hemai=zhongjiang.hemai;
    var shop=zhongjiang.shop;
    if(hemai){
    for(var i=0;i<hemai.length;i++){
      that.data.person.push(hemai[i]);
    }
    }
    if(shop){
    for (var i = 0; i<shop.length; i++) {
      that.data.person.push(shop[i]);
    }
    }
    that.setData({
      person:that.data.person
    })
    console.log(that.data.person);
  },
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
    that.kaijiangDate();
  },
//开奖日期判断
kaijiangDate:function(){
  var that=this;
  //获取当前日期
  //星期中的某一天，使用本地时间。返回值是 0（周日） 到 6（周六） 之间的一个整数。
  var d = new Date;
  var day = d.getDay();
  //周二，周四，周日开奖
  if (day == 2 || day == 4 || day == 0) {
    that.setData({
      shuangKaiJiang: 'true'
    })
  }
  //周一，周三，周六开奖
  if (day == 1 || day == 3 || day == 6) {
    that.setData({
      daletouKaiJiang: 'true'
    })
  }
  //周二，周五，周日开奖
  if (day == 2 || day == 5 || day == 0) {
    that.setData({
      qixingcaiKaiJiang: 'true'
    })
  }
},
//轮播图图片和彩种点击事件
shoplottery:function(event){
    var event=event.currentTarget.dataset.type;
    if(event=="shuangseqiu"){
      wx.navigateTo({
        url: '../shuangseqiu/shuangseqiu',
      })
    }else if(event=="daletou"){
      wx.navigateTo({
        url: '../daletou/daletou',
      })
    }else if(event=="qixingcai"){
      wx.navigateTo({
        url: '../qixingcai/qixingcai',
      })
    // }else if(event=="jingcaizuqiu"){
    //   wx.navigateTo({
    //     url: '../jingcaizuqiu/jingcaizuqiu',
    //   })
    // }else if(event=="fucai3D"){
    //   wx.navigateTo({
    //     url: '../fucai3D/fucai3D',
    //   })
    }
  },
// 活动图点击事件
gift:function(){
 wx.navigateTo({
   url: '../gift/gift',
 })
},
//更多彩种点击展开事件
more:function(){
  
},

})
