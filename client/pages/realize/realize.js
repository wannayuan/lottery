var app=getApp();
Page({
data:{
  name:"",
  phonenumber:"",
  address:"",
  IDcard:"",
  toastText: "", //警示框
  openid:"",
},
onLoad:function(){
  this.getOpenId();
},
inputname:function(e){
  this.setData({
    name:e.detail.value
  })
},
inputphone:function(e){
  this.setData({
    phonenumber:e.detail.value
  })
},
inputaddress:function(e){
  this.setData({
    address:e.detail.value
  })
},
inputIDcard:function(e){
  this.setData({
    IDcard:e.detail.value
  })
},
getOpenId:function() {
  var that = this;
  wx.login({
    success:function(res){
      var code=res.code;
      wx.request({
        url: "https://nh20i6qu.qcloud.la/weapp/login/index",
        data: {
          code:code
        },
        method: 'GET',
        success: function (res) {
          var openid=res.data.openid;
          that.setData({
            openid:openid,
          })
        },
  })
  }
  })
},
confirm:function(){
  var that=this;
  if(that.data.name==""||that.data.phonenumber==""||that.data.address==""||that.data.IDcard==""){
    that.setData({
     toastText:"请将信息填写完整!"
    });
   setTimeout(function(){
     that.setData({
       toastText:""
      })
    },bind(that),1500);
    return;
  }
  //判断用户表中是否有用户信息，如果没有，创建用户后再创建入驻申请，如果有用户信息，直接创建入驻申请
  var value=wx.getStorageSync("login");
  if(value){
    console.log("用户之前登陆过");
    //直接创建入驻申请
    wx.request({
      url:"https://nh20i6qu.qcloud.la/weapp/applymoment/index",
      data: {
        realname:that.data.name,
        telphone:that.data.phonenumber,
        address:that.data.address,
        IDcard:that.data.IDcard,
        openid:that.data.openid,
        nickname: app.globalData.userInfo.nickName
      },
      success: function (res) {
        that.setData({
          toastText: "提交成功",
        })
        setTimeout(function () {
          that.data.toastText = "";
          that.setData({
            toastText: that.data.toastText,
          });
          wx.switchTab({
            url: '../wode/wode',
          })
        }.bind(that), 1500);
      },
    })
  }else{
    //先创建用户，再创建入驻申请
    console.log("用户之前没有登陆过");
    wx.getSetting({
      success(res) {
        console.log("进入获取授权信息方法");
        if (!res.authSetting['scope.userInfo']) {
          //调起客户端小程序设置界面，返回用户设置的操作结果
          wx.openSetting({
            success: function (res) {
              if (!res.authSetting["scope.userInfo"]) {
                wx.authorize({
                  scope:'scope.userInfo',
                  success: function () {
                    // 用户已经同意小程序使用用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
                    wx.getUserInfo({
                      success: function (res) {
                        app.globalData.userInfo = res.userInfo;
                      }
                    })
                    //用户首次登录,返回openid，创建在数据库中创建用户信息
                   //现在user表和account中创建一条新数据，再在applyshop表中创建新数据
                    wx.request({
                      url:"https://nh20i6qu.qcloud.la/weapp/applywait/index",
                      data: {
                        realname:that.data.name,
                        telphone:that.data.phonenumber,
                        address:that.data.address,
                        IDcard:that.data.IDcard,
                        openid:that.data.openid,
                        nickname:app.globalData.userInfo.nickName
                      },
                      success: function (res) {
                        that.setData({
                          toastText: "提交成功",
                        });
                        wx.setStorageSync('login',that.data.openid);
                        setTimeout(function () {
                          that.data.toastText = "";
                          that.setData({
                            toastText: that.data.toastText,
                          });
                          wx.switchTab({
                            url: '../wode/wode',
                          })
                        }.bind(that), 1500);
                      },
                    })
                  },
                  fail: function () {
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
                    }.bind(that), 1500);
                    return;
                  }
                })
              }
            }
          })
        } else {
          wx.request({
            url:"https://nh20i6qu.qcloud.la/weapp/applywait/index",
            data: {
              realname: that.data.name,
              telphone: that.data.phonenumber,
              address: that.data.address,
              IDcard: that.data.IDcard,
              openid: that.data.openid,
              nickname: app.globalData.userInfo.nickName
            },
            success: function (res) {
              that.setData({
                toastText: "提交成功",
              });
              wx.setStorageSync('login', that.data.openid);
              setTimeout(function () {
                that.data.toastText = "";
                that.setData({
                  toastText: that.data.toastText,
                });
                wx.switchTab({
                  url: '../wode/wode',
                })
              }.bind(that), 1500);
            },
          })
        }
      }
    })
  }
}
})