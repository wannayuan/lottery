var app=getApp();
var spmc = 'ssq';
Page({
  data:{
   jine:"50",  //充值金额
   inputMoney:"false", //自定义输入框
   toastText:"" ,  //警告信息
   openid:'',
   userInfo:"",
   otherJine:"", //自定义金额
  },
onLoad:function(options){
},
//改变充值金额
changeMoney:function(event){
  var money=event.currentTarget.dataset.money;
  this.setData({
    jine:money,
   });
   if(money==""){
     this.setData({
       inputMoney: "true"
     })
  }
},
//立即支付
zhifu:function(){
    //调用微信支付接口
    this.wxpay();
},
//输入框失去焦点
blurMoney:function(e){
  var money=e.detail.value;
  this.setData({
    jine:money
  });
},
//取消
giveup:function(){
  this.setData({
    inputMoney:"false",
    jine:'50'
  })
},
//确定充值金额
confirm:function(){
  var money = this.data.jine;
  if (money < 301 || money > 1000 || money == "") {
    this.setData({
      'inputMoney': 'false',
      toastText: "请输入300-1000之间的整数",
      "jine": "50"
    });
    setTimeout(function () {
      this.setData({
        toastText: ""
      })
    }.bind(this), 2000);
  } else {
    this.setData({
      inputMoney: 'false',
    });
    this.zhifu();
 }
},
//用户登录，注册信息
userLogin: function () {
  var that = this;
  wx.login({
    success: function (res) {
      var code = res.code;
      console.log("临时登录态", code);
      if (code) {
        //就是在这里发起网络请求，使用wx.request()，将登陆态发送给自家的服务器上，在服务器端为用户创建账号
        wx.request({
          url: "https://nh20i6qu.qcloud.la/weapp/login/index",
          data: {
            code: code,
            appid: "wx4362f44fb0b39bd9",
            secret: "b3254c5654c38040bf9d940f6eab1ab3",
          },
          //发送请求成功将返回值保存在缓存中，并且为用户创建账号
          success: function (res) {
            console.log(res.data);
            var openid = res.data.openid;
            var session_key = res.data.session_key;
            //向服务器发送请求，在用户表和账户表中创建账号
            wx.request({
              url: 'https://nh20i6qu.qcloud.la/weapp/user/index',
              data: {
                nickName: app.globalData.userInfo.nickName,
                openid: openid,
              },
              success: function (res) {
                var user = res.data;
                wx.setStorageSync("login", user.login);
                //将服务器返回的openid保存到全局变量login中
                app.globalData.login = openid;
                //将openid保存到该页面的变量session中
                that.setData({
                  session: openid,
                })
                wx.setStorage({
                  key: 'information',
                  data: user.information,
                })
              }
            })
            //提示完善个人资料
            that.setData({
              IDCardStatus: true,
            })
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg);
      }
    },
  })
},
wxpay: function () {
  var that = this;
  var money=that.data.jine;
    //先创建账户
    var value = wx.getStorageSync("login");
    if (value) {
      console.log("用户之前登陆过");
      //登录过的话，将用户的唯一标志和付款金额发送到服务器端，看是否能够购买
      that.setData({
        openid: value,
      });
      that.generateOrder(that.data.openid);
    } else {
      console.log("用户之前没有登陆过");
      //获取授权信息
      wx.getSetting({
        success(res) {
          console.log("进入获取授权信息方法");
          if (!res.authSetting['scope.userInfo']) {
            //调起客户端小程序设置界面，返回用户设置的操作结果
            wx.openSetting({
              success: function (res) {
                if (!res.authSetting["scope.userInfo"]) {
                  wx.authorize({
                    scope: 'scope.userInfo',
                    success: function () {
                      // 用户已经同意小程序使用用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
                      wx.getUserInfo({
                        success: function (res) {
                          app.globalData.userInfo = res.userInfo;
                          that.setData({
                            userInfo: app.globalData.userInfo,
                          })
                        }
                      });
                      that.userLogin();
                    },
                    fail: function () {
                      console.log("用户拒绝授权获取用户信息");
                      //提示用户要授权才能购买彩票
                      that.data.toastText = "用户授权后才能购买";
                      that.setData({
                        toastText: that.data.toastText,
                      })
                      setTimeout(function () {
                        that.data.toastText = "";
                        that.setData({
                          toastText: that.data.toastText,
                        })
                      }.bind(that), 2000);
                      return;
                    }
                  })
                }
              }
            })
          } else {
            that.userLogin();
          }
        }
      })
    }
},
/**生成商户订单 */
generateOrder: function (openid) {
  var that = this;
  var money=that.data.jine*100;
  //统一支付
  wx.request({
    url:'https://www.delewu.com/ceshi/pay/zhifu1.jsp',
    method: 'GET',
    data: {
      wxid: openid,
      jine:money,
      spmc: spmc,
    },
    success: function (res) {

      var pay = res.data
      console.log('pay:',pay);
      //发起支付
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
pay:function (param){
  var that=this;
  wx.requestPayment({
    'timeStamp': param.timeStamp,
    'nonceStr': param.nonceStr,
    'package': param.package,
    'signType': param.signType,
    'paySign': param.paySign,
    'success': function (res) {
      // 支付成功，将账户表中对应玩家余额更新
      wx.request({
        url:'https://www.delewu.com/ceshi/anyi_chongzhi.jsp',
        data:{
          jine:that.data.jine,
          openid:that.data.openid,
        },
        success:function(res){
        console.log(res.data);
        that.setData({
          toastText: "支付成功",
        })
        setTimeout(function () {
          that.data.toastText = "";
          that.setData({
            toastText: that.data.toastText,
          })
        }.bind(that), 2000);
        }
      })
    },
    'fail':function (res) {
      // 支付失败，显示信息
      that.setData({
        toastText:"支付失败",
      })
      setTimeout(function () {
        that.data.toastText = "";
        that.setData({
          toastText: that.data.toastText,
        })
      }.bind(that), 2000);
    },
  })
 }
})