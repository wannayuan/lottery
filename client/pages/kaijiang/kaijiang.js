var qcloud = require('../../vendor/wafer2-client-sdk/index');
var app=getApp();
Page({
  data:{
  shuangseqiuInformation:[], //双色球开奖信息
  shuangseqiuTime: [], //双色球开奖日期
  shuangseqiuRedballs:[], //双色球开奖红球号码
  shuangseqiuBlueballs:[], //双色球开奖蓝球号码
  shuangseqiuQihao: "",//双色球期号
  "autoplay": "true",  //控制中奖滚动条
  "circular": "true",
  daletouQihao:"",   //大乐透开奖期号
  daletouRedballs:[], //大乐透开奖红色号码
  daletouBlueballs:[], //大乐透开奖蓝色号码
  qixingcaiQihao:"" , //七星彩开奖期号
  qixingcaiBalls:[],  //七星彩开奖号码
  //中奖滚动条的信息
  "person": [
    {
      "title": '***wanna',
      'type': "双色球",
      "money": 12800
    },
    {
      "title": "**晴天",
      "type": "七星彩",
      "money": 18000
    },
    {
      "title": "****下雨",
      "type": "大乐透",
      "money": 24000
    }
  ],
  },
//下拉刷新
onPullDownRefresh:function(){
  var that=this;
 wx.startPullDownRefresh({
   success:function(){
     //获取双色球，大乐透和七星彩的开奖信息
     qcloud.request({
       url: "https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou",
       success: function (res) {
         var daletouInformation = res.data.daletou;
         var qixingcaiInformation=res.data.qixingcai;
         var shuangseqiuInformation=res.data.shuangseqiu;
         app.globalData.daletouInformation = res.data.daletou;
         app.globalData.qixingcaiInformation=res.data.qixingcai;
         app.globalData.shuangseqiuInformation=res.data.shuangseqiu;
         that.setData({
           shuangseqiuQihao:information.information.tr2.qihao,
           shuangseqiuRedballs:information.information.tr2.redballs,
           shuangseqiuBlueballs:information.information.blueballs,
           daletouQihao: daletouInformation.tr2.qihao,
           daletouRedballs: daletouInformation.tr2.redballs,
           daletouBlueballs: daletouInformation.tr2.blueballs,
           qixingcaiQihao:qixingcaiInformation.tr2.qihao,
           qixingcaiBalls:qixingcaiInformation.tr2.balls,
         })
       }
     })
   },
   fail:function(){
   console.log("刷新失败");
   }
 })
 //停止当前页面下拉刷新
 wx.stopPullDownRefresh();
},
//向服务器请求开奖信息
onShow:function(){
  var that=this;
  qcloud.request({
    url: "https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou",
    success: function (res) {
      var daletouInformation = res.data.daletou;
      var qixingcaiInformation = res.data.qixingcai;
      var shuangseqiuInformation = res.data.shuangseqiu;
      app.globalData.daletouInformation = res.data.daletou;
      app.globalData.qixingcaiInformation = res.data.qixingcai;
      app.globalData.shuangseqiuInformation = res.data.shuangseqiu;
      that.setData({
        shuangseqiuQihao:shuangseqiuInformation.tr2.qihao,
        shuangseqiuRedballs:shuangseqiuInformation.tr2.redballs,
        shuangseqiuBlueballs:shuangseqiuInformation.tr2.blueballs,
        daletouQihao: daletouInformation.tr2.qihao,
        daletouRedballs: daletouInformation.tr2.redballs,
        daletouBlueballs: daletouInformation.tr2.blueballs,
        qixingcaiQihao: qixingcaiInformation.tr2.qihao,
        qixingcaiBalls: qixingcaiInformation.tr2.balls,
      })
    }
  })
},
//开奖xiangqing
history:function(event){
  var type = event.currentTarget.dataset.data;
  if(type=="双色球"){
    wx.navigateTo({
      url: '../shuangHistory/shuangHistory',
    })
  }else if(type=="大乐透"){
    wx.navigateTo({
      url: '../daletouHistory/daletouHistory',
    })
  }else if(type=="七星彩"){
    wx.navigateTo({
      url: '../qixingcaiHistory/qixingcaiHistory',
    })
  }
},
})