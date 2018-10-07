var app=getApp();
var spmc = 'ssq';
Page({
  data:{
   event:"",  //购买方式，自己买或者合买
   dangQi:"",  //最新期号
   shopInformation:"", //购买的信息
   money:"",  //余额支付应支付的金额
   toastText:"", //警示框
   jine:"",  //微信方式应支付的金额
  },
onLoad:function(options){
  console.log(app.globalData.shopInformation);
  var that=this;
  var event = options.event; //购买的方式
  var dangQi= options.dangQi; //购买的期号
  var money=options.money; //付款金额
  var jine=options.money*100; //微信支付的金额 
  that.setData({
    event:event,
    dangQi:dangQi,
    shopInformation:app.globalData.shopInformation,//投注号码的信息
    money:money,
    jine:jine,
  })
},
//支付方式
zhifu:function(e){
  var that=this;
  var method=e.currentTarget.dataset.data;
  var openid=wx.getStorageSync('login');
  if(method=="yue"){
    //余额支付，扣除相应的余额
   // 发起购买，默认的购买方式是余额支付
    wx.request({
      //单独买url 查询金额是否足够 更新可用余额和冻结金额
      url: 'https://nh20i6qu.qcloud.la/weapp/shop/index',
      data: {
        openid:openid,
        money: that.data.money,
      },
      success: function (res) {
        if (res.data==true) {  
          // 发起合买
          if(that.data.event=="hemai"){
        wx.request({
          url:'https://nh20i6qu.qcloud.la/weapp/Fhemai/index', 
          data: {
            betnumber: that.data.shopInformation.ballNumber, 
            username: that.data.shopInformation.username,
            multiple: that.data.shopInformation.multiple,
            copies: that.data.shopInformation.copies,
            lotterystation: that.data.shopInformation.dianpu,
            openid: that.data.shopInformation.openid,
            lotterytype: that.data.shopInformation.lotteryType,
            baodicopies: that.data.shopInformation.baodiCopies,
            issue: app.globalData.dangQi,
            zhuijia: that.data.shopInformation.zhuijia,
          },
          header: { "Content-Type": "application/json" },
          success: function (res) {
            //购买成功将保存号码的全局变量清零
            app.globalData.ballsList=[];
            app.globalData.daletouBallsList = [];
            app.globalData.qixingcaiBallsList=[];
            app.globalData.zhuijia=false,
              //本地保存号码的数组和保底份数请零
              that.setData({
                shopInformation: "",
              })
            //提示用户购买成功
            that.data.toastText = "支付成功";
            that.setData({
              toastText: that.data.toastText,
            })
            setTimeout(function () {
              that.data.toastText = "";
              that.setData({
                toastText: that.data.toastText,
              });
              wx.switchTab({
                url: '../caipiao/caipiao',
              })
            }.bind(that), 1500);
          }
        })
          }
          // 自己买
          if(that.data.event=="orderBy"){
            wx.request({
              url:'https://nh20i6qu.qcloud.la/weapp/aloneshop/index',
              data: {
                betnumber: that.data.shopInformation.ballNumber,
                username: that.data.shopInformation.username,
                multiple: that.data.shopInformation.multiple,
                copies:1,
                lotterystation: that.data.shopInformation.dianpu,
                openid: that.data.shopInformation.openid,
                lotterytype: that.data.shopInformation.lotteryType,
                issue: app.globalData.dangQi,
                zhuijia: that.data.shopInformation.zhuijia,
              },
              header: { "Content-Type": "application/json" },
              success: function (res) {
                //购买成功将保存号码的全局变量清零
                app.globalData.ballsList = [];
                app.globalData.daletouBallsList = [];
                app.globalData.qixingcaiBallsList = [];
                app.globalData.zhuijia = false;
                //本地保存号码的数组和保底份数请零
                that.setData({
                  shopInformation: "",
                });
                //  提示用户购买成功
                that.data.toastText = "支付成功";
                that.setData({
                  toastText: that.data.toastText,
                });
                setTimeout(function () {
                  that.data.toastText = "";
                  that.setData({
                    toastText: that.data.toastText,
                  });
                  wx.switchTab({
                    url: '../caipiao/caipiao',
                  })
                }.bind(that), 1500);
              }
            })
          }
          if(that.data.event=='chemai'){
            //参与别人发起的合买
            wx.request({
              url:'https://nh20i6qu.qcloud.la/weapp/Chemai/index',
              data:{
                openid:openid,
                betnumber: that.data.shopInformation.betnumber,
                username:app.globalData.userInfo.nickName,
                multiple: that.data.shopInformation.multiple,
                shopcopies:that.data.shopInformation.shopcopies,                    lotterystation:that.data.shopInformation.lotterystation,
                lotterytype: that.data.shopInformation.lotterytype,
                issue: that.data.shopInformation.issue,
                zhuijia: that.data.shopInformation.zhuijia,
                Pid: that.data.shopInformation.id,
                totalmoney:app.globalData.shopInformation['totalmoney'],
                lastcopies:app.globalData.shopInformation['lastcopies'],
              },
              success:function(res){
                //  提示用户购买成功
                that.data.toastText = "支付成功";
                that.setData({
                  toastText: that.data.toastText,
                });
                setTimeout(function () {
                  that.data.toastText = "";
                  that.setData({
                    toastText: that.data.toastText,
                  });
                }.bind(that), 1500);
              }
            })
          }
        } else {
          //不够的金额，跳转到支付界面
          //提示用户充值之后才能购买
          that.data.toastText ="余额不足";
          that.setData({
            toastText: that.data.toastText,
          })
          setTimeout(function () {
            that.data.toastText = "";
            that.setData({
              toastText: that.data.toastText,
            })
          }.bind(that), 1500);
        }
      }
    })
  }else if(method=="wechat"){
    //微信支付，调用微信接口，扣除相应费用
    console.log("微信支付");
    that.wxpay();
  }else if(method=="zhifubao"){
    //支付宝支付，调用支付宝接口，扣除相应费用
    console.log("支付宝待开通");
  }
},
//更多支付方式
moreMethod:function(){
  
},
wxpay: function () {
  var that = this;
  wx.login({
    success: function (res) {
      that.getOpenId(res.code);
    }
  });
},
getOpenId: function (code) {
  var that = this;
  wx.request({
    url: "https://nh20i6qu.qcloud.la/weapp/login/index",
    data: {
      code: code,
      appid: "wx4362f44fb0b39bd9",
      secret: "b3254c5654c38040bf9d940f6eab1ab3",
    },
    method: 'GET',
    success: function (res) {
      var openid=res.data.openid;
      that.generateOrder(openid);
    },
  })
},
/**生成商户订单 */
generateOrder: function (openid) {
  var that = this
  //统一支付
  wx.request({
    url: 'https://www.delewu.com/ceshi/pay/zhifu1.jsp',
    method: 'GET',
    data: {
      wxid: openid,
      jine:that.data.jine,
      spmc: spmc,
    },
    success: function (res) {
      var pay = res.data
     // 发起支付
      var timeStamp = pay.timeStamp;
      var packages = pay.package;
      var paySign = pay.sing;
      var nonceStr = pay.nonceStr;
      var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
      that.pay(param);
    },
  })
},

/* 支付   */
pay: function (param) {
  var that=this;
  wx.requestPayment({
    timeStamp: param.timeStamp,
    nonceStr: param.nonceStr,
    package: param.package,
    signType: param.signType,
    paySign: param.paySign,
    success: function (res) {
      //支付成功，将订单插入到相应的表中
      //购买成功将保存号码的全局变量清零
      if (that.data.event == "hemai") {
        wx.request({
          url: 'https://www.delewu.com/ceshi/hemai.jsp', //仅为示例，并非真实的接口地址
          data: {
            ballNumber: that.data.shopInformation.ballNumber,
            username: that.data.shopInformation.username,
            multiple: that.data.shopInformation.multiple,
            copies: that.data.shopInformation.copies,
            dianpu: that.data.shopInformation.dianpu,
            openid: that.data.shopInformation.openid,
            lotteryType: that.data.shopInformation.lotteryType,
            baodiCopies: that.data.shopInformation.baodiCopies,
            issue: app.globalData.dangQi,
            zhuijia: that.data.shopInformation.zhuijia,
          },
          header: { "Content-Type": "application/json" },
          success: function (res) {
            console.log(res.data);
            //购买成功将保存号码的全局变量清零
            app.globalData.ballsList = [];
            app.globalData.daletouBallsList = [];
            app.globalData.qixingcaiBallsList = [];
            app.globalData.zhuijia = false,
              //本地保存号码的数组和保底份数请零
              that.setData({
                shopInformation: "",
              })
            //提示用户购买成功
            that.data.toastText = "支付成功";
            that.setData({
              toastText: that.data.toastText,
            })
            setTimeout(function () {
              that.data.toastText = "";
              that.setData({
                toastText: that.data.toastText,
              });
              wx.switchTab({
                url: '../caipiao/caipiao',
              })
            }.bind(that), 2000);
          }
        })
      }
      // 自己买
      if (that.data.event == "orderBy") {
        console.log("将购买信息插入购买表中");
        wx.request({
          url: 'https://www.delewu.com/ceshi/orderBy.jsp', //仅为示例，并非真实的接口地址
          data: {
            ballNumber: that.data.shopInformation.ballNumber,
            username: that.data.shopInformation.username,
            multiple: that.data.shopInformation.multiple,
            copies: 1,
            dianpu: that.data.shopInformation.dianpu,
            openid: that.data.shopInformation.openid,
            lotteryType: that.data.shopInformation.lotteryType,
            issue: app.globalData.dangQi,
            zhuijia: that.data.shopInformation.zhuijia,
          },
          header: { "Content-Type": "application/json" },
          success: function (res) {
            console.log(res.data);
            //购买成功将保存号码的全局变量清零
            app.globalData.ballsList = [];
            app.globalData.daletouBallsList = [];
            app.globalData.qixingcaiBallsList = [];
            app.globalData.zhuijia = false;
            //本地保存号码的数组和保底份数请零
            that.setData({
              shopInformation: "",
            });
            //  提示用户购买成功
            that.data.toastText = "支付成功";
            that.setData({
              toastText: that.data.toastText,
            });
            setTimeout(function () {
              that.data.toastText = "";
              that.setData({
                toastText: that.data.toastText,
              });
              wx.switchTab({
                url: '../caipiao/caipiao',
              })
            }.bind(that), 2000);
          }
        })
      }
    },
    fail: function (res) {
      //提示用户购买成功
      that.data.toastText = "支付失败";
      that.setData({
        toastText: that.data.toastText,
      })
      setTimeout(function () {
        that.data.toastText = "";
        that.setData({
          toastText: that.data.toastText,
        });
        wx.switchTab({
          url: '../caipiao/caipiao',
        })
      }.bind(that), 2000);
    },
  })
}
})