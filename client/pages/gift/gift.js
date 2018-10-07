Page({
  data: {
    prizeState:1, //全部用户 1，彩票站 2，发起人 3,中奖金额 4
    jsonArray:[],  //中奖信息
  },
onLoad: function (options) {
  var that=this;
  wx.request({
    url: "https://www.delewu.com/ceshi/anyi_gift.jsp",
    data: {
      "prizeState":this.data.prizeState,
    },
    success: function (res) {
      var jsonArray = that.jsonMaopao(res.data);
      if(that.data.prizeState!=2){
        for(var i=0;i<jsonArray.length;i++){
          jsonArray[i].name=jsonArray[i].name.substr(-2);
        }
      }
      that.setData({
        jsonArray:jsonArray,
      });
    },
    fail: function () {
      console.log("访问服务器失败!");
    }
  });
},
//改变中奖率状态
changeState:function(event){
  var that=this;
  var state = event.currentTarget.dataset.prizestate;
  this.setData({
    prizeState: state
  });
  wx.request({
    url: "https://www.delewu.com/ceshi/anyi_gift.jsp",
    data:{
      "prizeState":state,
    },
    success:function(res){
     var jsonArray = that.jsonMaopao(res.data);
     if (that.data.prizeState != 2) {
       for (var i = 0; i < jsonArray.length; i++) {
         jsonArray[i].name=jsonArray[i].name.substr(-2);
       }
     }
     that.setData({
       jsonArray:jsonArray,
     })
    },
    fail:function(){
      console.log("访问服务器失败!");
    }
  })
},
//对返回的json数组进行按中奖率降序排列
jsonMaopao:function(array){
  for(var i=0;i<array.length;i++){
    for(var j=0;j<i;j++){
      if(parseInt(array[i].percent)>parseInt(array[j].percent)){
        var temp=array[i];
        array[i]=array[j];
        array[j]=temp;
      }
    }
 }
  return array;
},
})