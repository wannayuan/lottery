var app=getApp();
Page({
  data:{
   qixingcaiQihao:"",
   qixingcaiTime:"",
   qixingcaiBalls:[],
   qixingcaiXiaoliang:"",
   qixingcaiJiangchi:"",
   prize:[],
  },
onLoad:function(option){
  var that = this;
  var qixingcaiInformation= app.globalData.qixingcaiInformation;
  var index = option.index;
  for (var item in qixingcaiInformation){
    if(item==index){
      var qixingcai=qixingcaiInformation[item];
      that.setData({
        qixingcaiQihao: qixingcai.qihao,
        qixingcaiTime: qixingcai.kaijiangTime,
        qixingcaiBalls: qixingcai.balls,
        qixingcaiXiaoliang: qixingcai.xiaoliang,
        qixingcaiJiangchi: qixingcai.jiangchi,
        prize: qixingcai.prize,
      })
    }
  }
},
shop:function(){
  wx.navigateTo({
    url: '../qixingcai/qixingcai',
  })
}
})