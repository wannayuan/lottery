var qcloud = require('../../vendor/wafer2-client-sdk/index');
var app=getApp();
Page({
 data:{
   daletouInformation:[],  //保存大乐透开奖信息
 },
 //下拉刷新
 onPullDownRefresh: function () {
   var that = this;
   wx.startPullDownRefresh({
     success: function () {
       qcloud.request({
         url: "https://nh20i6qu.qcloud.la/Kaijiang/daletou",
         success: function (res) {
           app.globalData.daletouInformation = res.data.daletou;
           that.setData({
             daletouInformation: res.data.daletou,
           })
         }
       })
     },
     fail: function () {
       console.log("刷新失败");
     }
   })
   //停止当前页面下拉刷新
   wx.stopPullDownRefresh();
 },
onShow:function(){
  var that=this;
  if (app.globalData.daletouInformation!=""){
    that.setData({
      daletouInformation: app.globalData.daletouInformation,
    })
  }else{
    qcloud.request({
      url: "https://nh20i6qu.qcloud.la/Kaijiang/daletou",
      success: function (res) {
        app.globalData.daletouInformation = res.data.daletou;
        that.setData({
          daletouInformation:res.data.daletou,
        })
      }
    })
  }
},
//向服务器请求开奖信息
kaijiang: function (e) {
  var url = e.currentTarget.dataset.url;  //要访问页面的url
  var index=e.currentTarget.dataset.index;
  var url =url;
  var that = this;
   qcloud.request({
    url: 'https://nh20i6qu.qcloud.la/Daletouxiang/daletou',
    data: {
      url:url,
    },
    success: function (res) {
      app.globalData.daletouXiangqing=res.data;
      wx.navigateTo({
        url: '../daletoukaijiang/daletoukaijiang?index='+index,
      })
    }
  })
},
})