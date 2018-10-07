var app=getApp();
Page({
  data:{
    zhong:[],   //开奖信息
    shuangkai:'false',
    dakai:'false',
    qikai:'false',
    allkai:'false'
  },
onLoad:function(){
},
//开奖
kaijiang:function(e){
  var that=this;
  var type=e.currentTarget.dataset.data;
  if(type=="shuangseqiu"){
    wx.request({
      url: 'https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou',
      success: function (res) {
        //最新历史开奖信息
        var information=res.data.shuangseqiu.tr2;
        var qihao = information.qihao;
        var redString = "";
        var blueString = "";
        for(var i=0;i<information.redballs.length;i++){
          if(i==0)
          {redString+=information.redballs[i];}
          else{
           redString+=","+information.redballs[i];
          }
        }
        for (var i = 0; i<information.blueballs.length; i++) {
          if (i == 0)
          { blueString+=information.blueballs[i]; }
          else {
            blueString+=","+information.blueballs[i];
          }
        }
        wx.request({
     url:"https://nh20i6qu.qcloud.la/weapp/duijiang/shuangseqiu",
          data: {
            type:"双色球",
            qihao:qihao,
            redballs:redString,
            blueballs:blueString,
          },
          success:function(res) {
          //返回双色球各中奖等级的中奖信息
          console.log(res.data);
          app.globalData.zhongjiang.push(res.data);
          wx.setStorageSync('gonggao', res.data);
          var temp = [];
          if (res.data.hemai) {
            for (var i = 0; i < res.data.hemai.length; i++) {
              temp.push(res.data.hemai[i]);
            }
          }
          if (res.data.shop) {
            for (var i = 0; i < res.data.shop.length; i++) {
              temp.push(res.data.shop[i]);
            }
          }
          for (var i = 0; i < temp.length; i++) {
            that.data.zhong.push(temp[i]);
          }
          temp = that.data.zhong;
           that.setData({
             zhong:temp,
             shuangkai:'true',
             allkai:'true'
           })
          }
        })
      }
    })
  }else if(type=="daletou"){
    wx.request({
      url: 'https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou',
      success: function (res) {
        //最新历史开奖信息
        var information = res.data.daletou.tr2;
        var qihao = information.qihao;
        var redString = "";
        var blueString = "";
        for (var i = 0; i < information.redballs.length; i++) {
          if (i == 0)
          { redString += information.redballs[i]; }
          else {
            redString += "," + information.redballs[i];
          }
        }
        for (var i = 0; i < information.blueballs.length; i++) {
          if (i == 0)
          { blueString += information.blueballs[i]; }
          else {
            blueString += "," + information.blueballs[i];
          }
        }
        wx.request({
          url: "https://nh20i6qu.qcloud.la/weapp/duijiang/daletou",
          data: {
            type: "大乐透",
            qihao: qihao,
            redballs: redString,
            blueballs: blueString,
          },
          success: function (res) {
            //返回双色球各中奖等级的中奖信息
            console.log(res.data);
            app.globalData.zhongjiang.push(res.data);
            wx.setStorageSync('gonggao', res.data);
            var temp = [];
            if (res.data.hemai) {
              for (var i = 0; i < res.data.hemai.length; i++) {
                temp.push(res.data.hemai[i]);
              }
            }
            if (res.data.shop) {
              for (var i = 0; i < res.data.shop.length; i++) {
                temp.push(res.data.shop[i]);
              }
            }
            for (var i = 0; i < temp.length; i++) {
              that.data.zhong.push(temp[i]);
            }
            temp = that.data.zhong;
            that.setData({
              zhong:temp,
              dakai:'true',
              allkai: 'true'
            })
          }
        })
      }
    })
  }else if(type=="qixingcai"){
    wx.request({
      url:'https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou',
      success: function (res) {
        var information = res.data.qixingcai.tr2;
        var qihao = information.qihao;
        var ballString = "";
        for (var i = 0; i < information.balls.length; i++) {
          if (i == 0)
          { ballString += information.balls[i]; }
          else {
            ballString += "," + information.balls[i];
          }
        }
        wx.request({
          url:"https://nh20i6qu.qcloud.la/weapp/duijiang/qixingcai",
          data: {
            type: "七星彩",
            qihao:"18057",
            balls:"9,4,0,0,1,9,2",
          },
          success: function (res) {
            console.log(res.data);
            app.globalData.zhongjiang.push(res.data);
            wx.setStorageSync('gonggao',res.data);
            var temp=[];
            if(res.data.hemai){
            for(var i=0;i<res.data.hemai.length;i++){
              temp.push(res.data.hemai[i]);
            }
            }
            if(res.data.shop){
            for (var i = 0; i < res.data.shop.length; i++) {
              temp.push(res.data.shop[i]);
            }
            }
            for (var i = 0; i < temp.length; i++) {
              that.data.zhong.push(temp[i]);
            }
            temp = that.data.zhong;
            that.setData({
              zhong:temp,
              qikai:'true',
              allkai: 'true'
            })
            console.log(that.data.zhong);
          }
        })
      }
    })
  }else if (type =='allKaijiang'){
    wx.request({
      url: 'https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou',
      success: function (res) {
        //最新历史开奖信息
        var information = res.data.shuangseqiu.tr2;
        var qihao = information.qihao;
        var redString = "";
        var blueString = "";
        for (var i = 0; i < information.redballs.length; i++) {
          if (i == 0)
          { redString += information.redballs[i]; }
          else {
            redString += "," + information.redballs[i];
          }
        }
        for (var i = 0; i < information.blueballs.length; i++) {
          if (i == 0)
          { blueString += information.blueballs[i]; }
          else {
            blueString += "," + information.blueballs[i];
          }
        }
        wx.request({
     url:"https://nh20i6qu.qcloud.la/weapp/duijiang/shuangseqiu",
          data: {
            type: "双色球",
            qihao: qihao,
            redballs: redString,
            blueballs: blueString,
          },
          success: function (res) {
            //返回双色球各中奖等级的中奖信息
            console.log(res.data);
            app.globalData.zhongjiang.push(res.data);
            wx.setStorageSync('gonggao', res.data);
            var temp = [];
            if (res.data.hemai) {
              for (var i = 0; i < res.data.hemai.length; i++) {
                temp.push(res.data.hemai[i]);
              }
            }
            if (res.data.shop) {
              for (var i = 0; i < res.data.shop.length; i++) {
                temp.push(res.data.shop[i]);
              }
            }
            for (var i = 0; i < temp.length; i++) {
              that.data.zhong.push(temp[i]);
            }
            temp = that.data.zhong;
            that.setData({
              zhong:temp,
              shuangkai:'true',
              allkai: 'true'
            })
          }
        })
      }
    });
    wx.request({
      url: 'https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou',
      success: function (res) {
        //最新历史开奖信息
        var information = res.data.daletou.tr2;
        var qihao = information.qihao;
        var redString = "";
        var blueString = "";
        for (var i = 0; i < information.redballs.length; i++) {
          if (i == 0)
          { redString += information.redballs[i]; }
          else {
            redString += "," + information.redballs[i];
          }
        }
        for (var i = 0; i < information.blueballs.length; i++) {
          if (i == 0)
          { blueString += information.blueballs[i]; }
          else {
            blueString += "," + information.blueballs[i];
          }
        }
        wx.request({
          url: "https://nh20i6qu.qcloud.la/weapp/duijiang/daletou",
          data: {
            type: "大乐透",
            qihao: qihao,
            redballs: redString,
            blueballs: blueString,
          },
          success: function (res) {
            //返回双色球各中奖等级的中奖信息
            console.log(res.data);
            app.globalData.zhongjiang.push(res.data);
            wx.setStorageSync('gonggao', res.data);
            var temp = [];
            if (res.data.hemai) {
              for (var i = 0; i < res.data.hemai.length; i++) {
                temp.push(res.data.hemai[i]);
              }
            }
            if (res.data.shop) {
              for (var i = 0; i < res.data.shop.length; i++) {
                temp.push(res.data.shop[i]);
              }
            }
            for (var i = 0; i < temp.length; i++) {
              that.data.zhong.push(temp[i]);
            }
            temp = that.data.zhong;
            that.setData({
              zhong:temp,
              dakai:'true',
              allkai: 'true'
            })
          }
        })
      }
    });
     wx.request({
       url: 'https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou',
       success: function (res) {
         var information = res.data.qixingcai.tr2;
         var qihao = information.qihao;
         var ballString = "";
         for (var i = 0; i < information.balls.length; i++) {
           if (i == 0)
           { ballString += information.balls[i]; }
           else {
             ballString += "," + information.balls[i];
           }
         }
         wx.request({
         url:"https://nh20i6qu.qcloud.la/weapp/duijiang/qixingcai",
           data: {
             type: "七星彩",
             qihao: qihao,
             balls: ballString,
           },
           success: function (res) {
             console.log(res.data);
             app.globalData.zhongjiang.push(res.data);
             wx.setStorageSync('gonggao', res.data);
             var temp = [];
             if (res.data.hemai) {
               for (var i = 0; i < res.data.hemai.length; i++) {
                 temp.push(res.data.hemai[i]);
               }
             }
             if (res.data.shop) {
               for (var i = 0; i < res.data.shop.length; i++) {
                 temp.push(res.data.shop[i]);
               }
             }
             for(var i=0;i<temp.length;i++){
               that.data.zhong.push(temp[i]);
             }
             temp=that.data.zhong;
             that.setData({
               zhong:temp,
               qikai:'true',
               allkai: 'true'
             })
           }
         })
       }
     })
}
}
})
