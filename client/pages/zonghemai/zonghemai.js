Page({
  data: {
    hemai:[],  //合买信息，最高合买率
  },
  onShow: function () {
    var that = this;
    //获取
    wx.request({
      url:'https://nh20i6qu.qcloud.la/weapp/Tophemai/index',
      success: function (res) {
        that.setData({
        hemai:res.data,
        })
      }
    })
  },
  //合买详情
  xiangqing:function(e){
   var type=e.currentTarget.dataset.data;
   if(type=="双色球"){
     wx.navigateTo({
       url: '../shuangXiangqing/shuangXiangqing',
     })
   }else if(type=="大乐透"){
     wx.navigateTo({
       url: '../daletouXiang/daletouXiang',
     })
   }else if(type=="七星彩"){
     wx.navigateTo({
       url: '../qixingXiang/qixingXiang',
     })
   }
  }
})