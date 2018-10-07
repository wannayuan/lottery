var app=getApp();
Page({
  data:{
   History:"", //保存历史开奖信息，包括开奖日期，开奖期号，开奖的详细信息所在的url地址，红球和蓝球号码
  },
//下拉刷新
onPullDownRefresh:function(){
  var that=this;
 wx.startPullDownRefresh({
   success:function(){
     wx.request({
       url: "https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou",
       success: function (res) {
      app.globalData.shuangseqiuInformation=res.data.shuangseqiu;
         that.setData({
           History:res.data.shuangseqiu,
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
onShow:function(){
  var that=this;
  //想服务器发送网络请求，获取历史开奖信息，包括开奖日期，开奖期号，开奖的详细信息所在页面的url地址，红球和蓝球号码

 //如果history中有数据，则不需要再次发送网络请求，避免浪费流量和内存
  if (app.globalData.shuangseqiuInformation!=""){
    that.setData({
      History:app.globalData.shuangseqiuInformation,
    })
    return;
  }
  wx.request({
    url: "https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou",
    success: function (res) {
      app.globalData.shuangseqiuInformation = res.data.shuangseqiu;
      that.setData({
        History: res.data.shuangseqiu,
      })
    }
  })  
},
//向服务器请求开奖信息
kaijiang: function (e) {
  var index=e.currentTarget.dataset.index;  //要访问页面的url
  var that = this;
  wx.navigateTo({
    url:'../shuangseqiukaijiang/shuangseqiukaijiang?index='+index,
  })
  // wx.request({
  //   url: 'https://www.delewu.com/curl/ticket.php',
  //   data:{
  //     url:url,
  //   },
  //   success: function (res) {
  //     var information = res.data;
  //     app.globalData.shuangseqiuInformation = information;
  //     app.globalData.shuangseqiuQihao = information.information.qihao;
  //     app.globalData.shuangseqiuTime = information.information.kaijiang;
  //     app.globalData.shuangseqiuRedballs = information.information.redballs;//双色球开奖红球号码
  //     app.globalData.shuangseqiuBlueballs = information.information.blueballs; //双色球开奖蓝球号码
  //     app.globalData.shuangseqiuXiaoliang = information.information.xiaoliang; //双色球开奖销量
  //     app.globalData.shuangseqiuJiangchi = information.information.jiangchi; //双色球开奖奖池
  //    wx.navigateTo({
  //      url: '../shuangseqiukaijiang/shuangseqiukaijiang',
  //    })
  //   }
  // })
},
})