var app = getApp();
Page({
  data: {
    jine:0,  //微信调用支付接口要支付的金额
    lastMoney:"",
    event:"",
    dangQi:"",
  },
  onLoad: function (option) {
   var lastMoney=option.lastMoney;
   console.log("event"+event+"dangQi"+dangQi);
   this.setData({
     jine:lastMoney,
     lastMoney:lastMoney,
   })
  },
  //支付方式
  zhifu: function (e) {
    var that=this;
    var method = e.currentTarget.dataset.data;
    if (method == "wechat") {
      //微信支付，调用微信接口，扣除相应费用
      console.log("微信支付");
      that.wxpay();
    } else if (method == "zhifubao")
      //支付宝支付，调用支付宝接口，扣除相应费用
      console.log("支付宝待开通");
  },
  //更多支付方式
  moreMethod: function () {

  },
  wxpay: function () {
    // console.log('onLoad testdfdfdf');
    var that = this;
    //登陆获取code
    wx.login({
      success: function (res) {
        //获取openid
        that.getOpenId(res.code);
      }
    });
  },
  getOpenId: function (code) {
    var that = this;
    console.log('code:' + code)
    wx.request({
      url: "https://www.delewu.com/ceshi/daiopenid.jsp",
      data: {
        code: code
      },
      method: 'GET',
      success: function (res) {
        var openid_js = res.data;
        var openid = openid_js.openids;
        //console.log('getopenid0:' + openid);
        that.generateOrder(openid);
        //console.log('getopenid:' + openid_js);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
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
        //total_fee: '5',
        // body: '支付测试',
        //attach: '真假酒水',
        wxid: openid,
        //  jine: jine,
        jine:that.data.jine,
        spmc: spmc,
      },
      success: function (res) {

        var pay = res.data
        console.log('pay:' + pay);
        //发起支付
        var timeStamp = pay.timeStamp;
        var packages = pay.package;
        var paySign = pay.sing;
        var nonceStr = pay.nonceStr;

        console.log('timeStamp:' + timeStamp);
        console.log('paySign:' + paySign);
        console.log('packages:' + packages);
        console.log('nonceStr:' + nonceStr);
        var param = { "timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
        that.pay(param);
      },
    })
  },

  /* 支付   */
  pay: function (param) {
    console.log("支付")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        // success
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
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
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function () {
            // fail

          },
          complete: function () {
            // complete
          }
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})