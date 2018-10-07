var qcloud = require('../../vendor/wafer2-client-sdk/index');
var app = getApp();
Page({
  data: {
    qixingcaiInformation: [],  //保存七星彩开奖信息
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    wx.startPullDownRefresh({
      success: function () {
        qcloud.request({
          url: "https://nh20i6qu.qcloud.la/Kaijiang/qixingcai",
          success: function (res) {
            app.globalData.qixingcaiInformation = res.data.qixingcai;
            that.setData({
              qixingcaiInformation: res.data.qixingcai,
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
  onShow: function () {
    var that=this;
    if (app.globalData.qixingcaiInformation!="") {
      that.setData({
        qixingcaiInformation:app.globalData.qixingcaiInformation ,
      })
    } else {
      qcloud.request({
        url: "https://nh20i6qu.qcloud.la/Kaijiang/daletou",
        success: function (res) {
          app.globalData.qixingcaiInformation=res.data.qixingcai;
          that.setData({
            qixingcaiInformation : res.data.qixingcai,
          })
        }
      })
    }
  },
  kaijiang: function (e) {
    var index = e.currentTarget.dataset.index;  //要访问页面的index
    wx.navigateTo({
      url: '../qixingcaiKaijiang/qixingcaiKaijiang?index='+index,
    })
  },
})