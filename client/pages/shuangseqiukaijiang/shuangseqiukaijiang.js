var app=getApp();
Page({
  data:{
    shuangseqiuInformation: "", //双色球开奖全部数据
    shuangseqiuTime: [], //双色球开奖日期
    shuangseqiuRedballs: [], //双色球开奖红球号码
    shuangseqiuBlueballs: [], //双色球开奖蓝球号码
    shuangseqiuQihao: "",//双色球期号
    shuangseqiuXiaoliang: "",//双色球销量
    shuangseqiuJiangchi: "",//双色球奖池
    prize:[],//双色球开奖中奖信息
  },
onLoad:function(option){
  var index=option.index;
  var information = app.globalData.shuangseqiuInformation[index];
 this.setData({
   shuangseqiuTime:information.kaijiangTime,
   shuangseqiuRedballs: information.redballs,
   shuangseqiuBlueballs: information.blueballs,
   shuangseqiuQihao:information.qihao,
   shuangseqiuXiaoliang:information.xiaoliang,
   shuangseqiuJiangchi:information.jiangchi,
   prize:information.prize,
 })
},
shop:function(){
  //跳转到购买界面
  wx.navigateTo({
    url: '../shuangseqiu/shuangseqiu',
  })
}
})