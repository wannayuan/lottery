// myhemai.js
var app = getApp();
Page({
  data: {
    prizeState:1,   //默认为1，全部，2，已中奖，3.待开奖 
    hemaiOrder:[],  //合买订单
    selectOrder:[],  //合买订单是否展开
  },
  onLoad: function (options) {
    var that = this;
    var value = app.globalData.login;
    wx.request({
      url:"https://nh20i6qu.qcloud.la/weapp/myhemai/index",
      data:{
        openid:value,
        prizeState:this.data.prizeState
      },
      success: function (res) {
        var jsonArray = that.jsonMaopao(res.data);
        that.setData({
          hemaiOrder:jsonArray
        })
      }
    })
  },
//对返回的json数组进行按完成率降序排列
jsonMaopao: function (array) {
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < i; j++) {
      if (parseInt(array[i].percent) > parseInt(array[j].percent)) {
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  }
  return array;
},
//改变查询方式
changeState:function(e){
  var that=this;
  var prizeState=e.currentTarget.dataset.prizestate;
  that.setData({
    prizeState:prizeState
  })
  wx.request({
    url:"https://nh20i6qu.qcloud.la/weapp/myhemai/index",
    data: {
      openid:app.globalData.login,
      prizeState: this.data.prizeState,
    },
    success: function (res) {
      var jsonArray=that.jsonMaopao(res.data);
      that.setData({
        hemaiOrder:jsonArray,
      })
    }
  })
},
//合买信息是否展开
changeSelect:function(e) {
  var index=e.currentTarget.dataset.index;
  var temp=this.data.hemaiOrder;
  var hemaiOrder=[];
  for (var i = 0; i<temp.length;i++){
   if(index==i){
     if(temp[i].select==false){
       hemaiOrder[i] = {'lotterytype':temp[i].lotterytype,'shoptype': temp[i].shoptype, 'issue': temp[i].issue, 'betnumber': temp[i].betnumber, 'username': temp[i].username, 'percent':temp[i].percent,'select':true};
     }else{
       hemaiOrder[i] = { 'lotterytype':temp[i].lotterytype,'shoptype': temp[i].shoptype, 'issue': temp[i].issue, 'betnumber': temp[i].betnumber, 'username': temp[i].username, 'percent': temp[i].percent, 'select':false};
     }
   }else{
    hemaiOrder[i]=temp[i];
   }
  }
  this.setData({
    hemaiOrder:hemaiOrder
  })
}
})