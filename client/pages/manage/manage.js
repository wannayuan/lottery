Page({
  data:{
    prizeState:1,   //默认为全部 
    shuangArray:[],  //双色球统计信息
    daletouArray:[], //大乐透统计信息
    qixingcaiArray:[] //七星彩统计信息
  },
onLoad:function(options){
  //全部
  this.shuang();
  this.daletou();
  this.qixingcai();
},
//改变查询方式
changeState: function (e) {
  var that = this;
  var prizeState = e.currentTarget.dataset.prizestate;
  that.setData({
    prizeState: prizeState
  })
  if(that.data.prizeState==2){
    //双色球
   this.shuang();
  }else if(prizeState==3){
    //大乐透
   this.daletou();
  }else if(prizeState==4){
    //七星彩
   this.qixingcai();
  }else if(prizeState==1){
   //全部
   this.shuang();
   this.daletou();
   this.qixingcai();
  }
},
shuang:function(){
  var that=this;
  wx.request({
    url: "https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou",
    success: function (res) {
      var information = res.data.shuangseqiu.tr2;
      var qihao = information.qihao;
      // var redString = "";
      // var blueString = "";
      // for (var i = 0; i < information.redballs.length; i++) {
      //   if (i == 0)
      //   { redString += information.redballs[i]; }
      //   else {
      //     redString += "," + information.redballs[i];
      //   }
      // }
      // for (var i = 0; i < information.blueballs.length; i++) {
      //   if (i == 0)
      //   { blueString += information.blueballs[i]; }
      //   else {
      //     blueString += "," + information.blueballs[i];
      //   }
      // }
      wx.request({
        url: "https://nh20i6qu.qcloud.la/weapp/tongjishuang",
        data: {
          qihao: qihao,
          type: "双色球",
          // redballs: redString,
          // blueballs: blueString,
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            shuangArray: res.data.shuangseqiu,
          })
        }
      })
    }
  })
},
daletou:function(){
  var that = this;
  wx.request({
    url:'https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou',
    success: function (res) {
      var information = res.data.daletou.tr2;
      var qihao = information.qihao;
      // var redString = "";
      // var blueString = "";
      // for (var i = 0; i < information.redballs.length; i++) {
      //   if (i == 0)
      //   { redString += information.redballs[i]; }
      //   else {
      //     redString += "," + information.redballs[i];
      //   }
      // }
      // for (var i = 0; i < information.blueballs.length; i++) {
      //   if (i == 0)
      //   { blueString += information.blueballs[i]; }
      //   else {
      //     blueString += "," + information.blueballs[i];
      //   }
      //   var betnumber=redString+blueString;
      // }
      wx.request({
        url:"https://nh20i6qu.qcloud.la/weapp/tongjida/index",
        data: {
          type: "大乐透",
          qihao: qihao,
          // redballs: redString,
          // blueballs: blueString,
        },
        success:function (res) {
          console.log(res.data);
          that.setData({
            daletouArray: res.data.daletou
          })
        }
      })
    }
  });
},
qixingcai:function(){
  var that = this;
  wx.request({
    url: 'https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou',
    success: function (res) {
      var information = res.data.qixingcai.tr2;
      var qihao = information.qihao;
      // var redString = "";
      // var blueString = "";
      // for (var i = 0; i < information.redballs.length; i++) {
      //   if (i == 0)
      //   { redString += information.redballs[i]; }
      //   else {
      //     redString += "," + information.redballs[i];
      //   }
      // }
      // for (var i = 0; i < information.blueballs.length; i++) {
      //   if (i == 0)
      //   { blueString += information.blueballs[i]; }
      //   else {
      //     blueString += "," + information.blueballs[i];
      //   }
      //   var betnumber = redString + blueString;
      // }
      wx.request({
        url: "https://nh20i6qu.qcloud.la/weapp/tongjiqi/index",
        data: {
          type: "七星彩",
          qihao: qihao,
          // redballs: redString,
          // blueballs: blueString,
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            qixingcaiArray: res.data.qixingcai
          })
        }
      })
    }
  });
}
})