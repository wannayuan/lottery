var app=getApp();
Page({
  data: {
    daletouHemai: [], //双色球合买详情
    toastText: "",  //弹出窗口提示信息
  },
  onShow: function () {
    var that = this;
    wx.request({
      //获取大乐透的全部合买信息
      url:"https://nh20i6qu.qcloud.la/weapp/Daletouhemai/index",
      success: function (res) {
        var jsonArray=that.jsonMaopao(res.data);
        that.setData({
          daletouHemai:jsonArray,
        })
        app.globalData.daletouHemai=res.data;
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
  //前去合买
 shopHemai: function (e) {
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    //判断用户是否登录
    var value = wx.getStorageSync("login");
    if (value) {
      //用户已经登录,跳转到合买界面
      wx.navigateTo({
        url: '../goHemai/goHemai?index=' + index + "&type=" + type,
      })
    } else {
      //获取授权信息
      wx.getSetting({
        success(res) {
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
                        }
                      })
                      //用户首次登录,返回openid，创建在数据库中创建用户信息
                      that.userLogin();
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
            //已经获取到用户权限，用户首次登录,创建用户信息，账户金额为1000元，测试阶段默认是可以直接购买的
            that.userLogin();
          }
        }
      })
    }
  },
  //用户登录，注册信息
  userLogin: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          //就是在这里发起网络请求，使用wx.request()，将登陆态发送给自家的服务器上，在服务器端为用户创建账号
          wx.request({
            url: "https://nh20i6qu.qcloud.la/weapp/login/index",
            data: {
              code: res.code,
              appid: "wx4362f44fb0b39bd9",
              secret: "b3254c5654c38040bf9d940f6eab1ab3",
            },
            //发送请求成功将返回值保存在缓存中，并且为用户创建账号
            success: function (res) {
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
              //跳转到合买界面
              wx.navigateTo({
                url: '../goHemai/goHemai?index='+index + "&type=" + type,
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      },
    })
  },
})