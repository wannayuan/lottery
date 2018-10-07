// 登录界面
var app=getApp();
var check = require("../../utils/check.js")
var webUtils = require("../../utils/registerWebUtil.js");
Page({
  data: {
   username:"",  //昵称
   password:"",   //密码
   remember:false,  //是否记住密码
   zidongLogin:false,//是否自动登录
  },
onLoad:function(){
  var that=this;
  //判断之前是否保存了用户名和密码
  if (wx.getStorageSync('zidongLogin')==true){
    var username = wx.getStorageSync('username');
    var password = wx.getStorageSync('password');
    that.setData({
      username:username,
      password:password,
    })
    wx.showToast({
      title:'正在登录',
      icon: 'loading',
      duration:2000
    })
    setTimeout(that.login,2000);
  }else{
    var username=wx.getStorageSync('username');
    if (username) {
      that.setData({
        username: username,
      })
    }
    var password = wx.getStorageSync('password');
    if (password) {
      this.setData({
        password: password
      })
    }
  }
},
//前去注册
register:function(){
  wx.navigateTo({
    url:'../register/register',
  })
},
//忘记密码
forgetpass:function(){
 wx.navigateTo({
   url:'../forgetpass/forgetpass',
 })
},
//自动登录
zidongLogin:function(e){
 var array=e.detail.value;
 if(array.length>0){
   this.setData({
     zidongLogin:true
   })
 }else{
   this.setData({
     zidongLogin:false
   })
 }
},
//记住密码
remember:function(e){
  var array=e.detail.value;
  if(array.length>0){
    //记住密码
    this.setData({
      remember:true,
    })
  }else{
    this.setData({
      remember:false
    })
  }
},
inputnickname:function(e){
 var username=e.detail.value;
 this.setData({
   username:username,
 })
},
inputpassword:function(e){
 var password=e.detail.value;
 this.setData({
   password:password,
 })
},
//登录
login:function(){
  var that=this;
  wx.request({
    url:"https://nh20i6qu.qcloud.la/weapp/signin/index",
    data:{
      username:that.data.username,
      password:that.data.password
    },
    success:function(res){
      console.log(res.data);
      if(res.data.login=="true"){
        wx.setStorageSync('login', res.data.openid);
        app.globalData.login=res.data.openid;
        if (that.data.remember==true) {
          wx.setStorageSync('username', that.data.username);
          wx.setStorageSync('password', that.data.password);
          if (that.data.zidongLogin == true) {
            wx.setStorageSync('zidongLogin', true);
          }
        }
        wx.switchTab({
          url: '../wode/wode',
        })
      }else{
      that.setData({
        loginWarning:'用户名或密码错误!'
      })
      }
    }
  })
}
})