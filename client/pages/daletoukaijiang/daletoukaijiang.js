var app=getApp();
Page({
  data:{
   daletouQihao:"",
   daletouTime:"",
   daletouRedballs:[],
   daletouBlueballs:[],
   daletouXiaoliang:"",
   daletouJiangchi:"",
   prize:[],
  },
onLoad:function(option){
 var index=option.index;
 var daletouInformation=app.globalData.daletouInformation;
 var that=this;
 for(var item in daletouInformation){
   if(item==index){
     var daletou=daletouInformation[item];
     that.setData({
       daletouQihao:daletou.qihao,
       daletouTime:daletou.kaijiangTime,
       daletouRedballs:daletou.redballs,
       daletouBlueballs:daletou.blueballs,
       daletouXiaoliang:daletou.xiaoliang,
       daletouJiangchi:daletou.jiangchi,
     })
   }
 }
},
onShow:function(){
  var that=this;
  var qixingcaiInformation = app.globalData.qixingcaiInformation;
  var qixingcai = qixingcaiInformation.tr5;
  that.setData({
    prize:qixingcai.prize,
  })
  console.log(that.data.prize);
},
shop:function(){
  wx.navigateTo({
    url: '../daletou/daletou',
  })
}
})