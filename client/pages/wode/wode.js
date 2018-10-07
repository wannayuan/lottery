// pages/wode/wode.js
var app = getApp();
Page({
  data: {
    userInfo: {},
    account: {},
    toastText: "", //弹框提示信息
    myorderdata:"false",
    myhemaidata:"false",
    quanxian: "caipiaozhan",
    ruzhu:"false", //入驻弹出框 
    login:"false", //登录状态
    loginText:""
  },
  onShow: function (options) {  
    var that = this;
    this.setData({
      userInfo:app.globalData.userInfo,
    })
    var value =wx.getStorageSync("login");
    if(value!=""){
      that.setData({
        login:true,
        loginText:'注销'
      })
      wx.request({
        //获取用户权限和账户余额
        url:'https://nh20i6qu.qcloud.la/weapp/Account/index',
        data: {openid:value},
        header: {
          "Content-Type":"application/json"
        },
        method: "GET",
        success: function (res) {
        console.log(res.data);
        var account=res.data.account;
        var quanxian=res.data.quanxian;
        that.setData({
          account:account,
          quanxian:quanxian
        })
        }
      }) 
    }else{
     that.setData({
       account:app.globalData.account,
       login:false,
       loginText:'登录'
     });
    }
  },
  //充值,跳转到充值金额选择界面
  chongzhi:function(){
    wx.navigateTo({
      url: '../chongzhiMoney/chongzhiMoney',
    })
  },
  //提现
  tixian:function(){
    wx.navigateTo({
      url: '../tixian/tixian?usemoney='+this.data.account.usemoney,
    })
  },
  //手机注册
  message:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  },
  information: function () {
    var value=wx.getStorageSync("login");
    if(value==""){
      //弹框提示信息
      this.data.toastText= "没有注册，请前去购买注册后完善资料";
      this.setData({
        toastText: this.data.toastText,
      })
      setTimeout(function () {
        this.data.toastText = "";
        this.setData({
          toastText: this.data.toastText,
        })
      }.bind(this), 1500);
     }else{
      wx.navigateTo({
        url: '../information/information',
      })
    }
  },
  //全部订单
myorder: function () {
  var that=this;
  var value=wx.getStorageSync('login');
  if (value != ""){
    //跳转到订单记录页面
    wx.navigateTo({
      url: '../myorder/myorder',
    })
  }else{
      this.data.toastText = "未登录，请前去登录！";
      this.setData({
        toastText: this.data.toastText,
      })
      setTimeout(function () {
        this.data.toastText = "";
        this.setData({
          toastText: this.data.toastText,
        })
      }.bind(this), 2000); 
    }
  },
  //我的合买记录
  myhemai: function () {
    //如果是未注册用户，弹提示，如果注册了，跳转
    var value = wx.getStorageSync('login');
    if (value!= "") {
      wx.navigateTo({
        url: '../myhemai/myhemai',
      })
    } else {
      //弹框提示信息
      this.data.toastText = "未登录，请前去登录！";
      this.setData({
        toastText: this.data.toastText,
      })
      setTimeout(function () {
        this.data.toastText = "";
        this.setData({
          toastText: this.data.toastText,
        })
      }.bind(this), 2000);    
    }
  },
//追加订单
zhuijiaOrder:function(){
  //如果是未注册用户，弹提示，如果注册了，跳转
  var value = wx.getStorageSync('login');
  if (value != "") {
    wx.navigateTo({
      url: '../zhuijia/zhuijia',
    })
  } else {
    //弹框提示信息
    this.data.toastText = "未登录，请前去登录！";
    this.setData({
      toastText: this.data.toastText,
    })
    setTimeout(function () {
      this.data.toastText = "";
      this.setData({
        toastText: this.data.toastText,
      })
      wx.navigateTo({
        url: '../signup/signup',
      })
    }.bind(this), 2000);
  }
},
//彩票站抢单
qiangdan:function(){

  wx.navigateTo({
    url: '../qiangdan/qiangdan'
  })
},
//资金明细
moneyDetail:function(){
  wx.navigateTo({
    url:'../moneyDetail/moneyDetail',
  })
},
//提款记录
tixianRecord:function(){
  wx.navigateTo({
    url:'../tixianRecord/tixianRecord',
  })
},
//店家入驻
ruzhu:function(){
 this.setData({
   ruzhu:"true"
 })
},
//立即申请
realize:function(){
  this.setData({
    ruzhu:"false"
  });
  wx.navigateTo({
    url: '../realize/realize',
  })
},
//下次再说
giveup:function(){
  this.setData({
    ruzhu: "false"
  });
},
//派奖
duijiang:function(){
  wx.navigateTo({
    url: '../duijiang/duijiang',
  })
},
//后台管理
manage:function(){
  wx.navigateTo({
    url:'../manage/manage',
  })
},
//商家店铺管理
Managedianpu:function(){
 wx.navigateTo({
   url: '../Managedianpu/Managedianpu',
 })
},
//服务商申请管理
Manageshenqing:function(){
 var value = wx.getStorageSync('login');
 if (value != "") {
   wx.navigateTo({
     url: '../Manageshenqing/Manageshenqing',
   })
 } else {
   //弹框提示信息
   this.data.toastText = "未登录，请前去登录！";
   this.setData({
     toastText: this.data.toastText,
   })
   setTimeout(function () {
     this.data.toastText = "";
     this.setData({
       toastText: this.data.toastText,
     })
   }.bind(this), 2000);
 }
},
//登录
login:function () {
  wx.navigateTo({
    url:'../signup/signup',
  })
},
//注销
loginout: function () {
  var that=this;
  wx.setStorageSync('login',"");
 // wx.setStorageSync('username', "");
  //wx.setStorageSync('password', "");
  that.setData({
    login:false,
    loginText:'登录',
    account: app.globalData.account,
  })
}
})