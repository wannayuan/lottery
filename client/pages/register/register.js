var app = getApp();
// var step = 1 // 当前操作的step  
var maxTime = 60
var currentTime =-1; //倒计时的事件（单位：s）  
var interval = null
var hintMsg = null // 提示  

var check = require("../../utils/check.js")
var webUtils = require("../../utils/registerWebUtil.js")
var login= require("../../utils/login.js")
var step_g = 1

var phoneNum="", identifyCode="", password="", rePassword="";

Page({
  data: {
    windowWidth: 0,
    windoeHeight: 0,
    icon_phone: "",
    input_icon: "",
    icon_password: "",
    location:"中国",
    nextButtonWidth: 0,
    step: step_g,
    time: maxTime,
    nickname:"", //用户名
    name: "",//用户真实姓名
    IDcard: "",//用户的身份证号
    phonenumber: "",//用户注册的电话号码
    password:"",  //密码
    login:"",      //用户的唯一标识
    code:false, //是否获取过验证码
  },
  onLoad: function () {
    step_g = 1
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          nextButtonWidth: res.windowWidth - 20,
          username:app.globalData.userInfo.nickName,
        })
      }
    })
  },
  onUnload: function () {
    currentTime = maxTime
    if (interval != null) {
      clearInterval(interval)
    }
  },
  nextStep: function () {
    var that = this;
    if (step_g == 1) {
      //验证电话号码格式
      if (!check.checkPhoneNum(phoneNum)||phoneNum.length != 11) {
        hintMsg = "请输入正确的电话号码!";
      }else{
        // webUtils.submitPhoneNum(phoneNum, "wanna");
        if(secondStep()) {
          //验证码正确，将电话号码值赋值给phoneNumber
          that.setData({
            phonenumber: phoneNum,
          })
          step_g = 2;
          clearInterval(interval);
        }
      }
    }else if(step_g==2){
      if(thirdStep()){
        that.setData({
          password:password
        })
        step_g=3;
      }
    }else{
      if (that.lastStep()){
        wx.login({
          success:function(res){
            var code=res.code;
            console.log(code);
            if(code){
              wx.request({
                url: "https://nh20i6qu.qcloud.la/weapp/login/index",
                data: {
                  code: code,
                  appid: "wx4362f44fb0b39bd9",
                  secret: "b3254c5654c38040bf9d940f6eab1ab3",
                },
                success: function (res) {
                  var openid = res.data.openid;
                  console.log(openid);
                  wx.request({
                    url: 'https://nh20i6qu.qcloud.la/weapp/register',
                    data: {
                      nickname: that.data.nickname,
                      realname: that.data.name,
                      IDcard: that.data.IDcard,
                      phonenumber: that.data.phonenumber,
                      password: that.data.password,
                      openid:openid
                    },
                    success:function(res){
                     wx.setStorageSync('login',res.data);//保存登录状态
                     wx.switchTab ({
                       url:'../wode/wode',
                     })
                   }
                  })      
                }
              })
            }
          }
        })
      }
    }
  if (hintMsg!= null) {
      wx.showToast({
        title: hintMsg,
        icon: 'loading',
        duration: 700
      })
    }
    this.setData({
      step: step_g
    })
  },
  input_phoneNum: function (e) {
    phoneNum = e.detail.value
  },
  input_identifyCode: function (e) {
    identifyCode = e.detail.value
  },
  input_password: function (e) {
    password = e.detail.value
  },
  input_rePassword: function (e) {
    rePassword = e.detail.value
  },
  //获取用户的身份证号
IDcard:function(e) {
    var value = e.detail.value;
    if(value!=''&&value.length==18){
      this.setData({
        IDcard:value,
      })
    }
  },
  //获取用户的真实姓名
 name:function (e) {
    var value = e.detail.value;
    if(value!=''){
      this.setData({
        name:value,
      })
    }
  },
  //获取用户名
nickname:function(e){
    var value=e.detail.value;
    if(value!=""){
     this.setData({
        nickname:value,
      })
    }
  },
lastStep:function(){
  if(this.data.IDcard==""||this.data.name==""||this.data.nickname==""){
  hintMsg = '信息填写不正确！'
  return false;
}
  return true;
},
reSendPhoneNum:function() {
  var that=this;
  if (check.checkPhoneNum(phoneNum)&&phoneNum.length== 11){
      if (currentTime<0) {
        that.setData({
          code:true,
        });
        webUtils.submitPhoneNum(phoneNum);
        currentTime=maxTime;
        interval = setInterval(function () {
          currentTime--;
          that.setData({
            time:currentTime,
          })
          if (currentTime<=0) {
            currentTime=-1;
            clearInterval(interval);
            that.setData({
              code:false,
            })
          }
        }, 1000);
      }else{
        hintMsg='短信已发送';
        wx.showToast({
          title: hintMsg,
          icon: 'loading',
          duration: 700
        })
      }
    }else{
    hintMsg = "请输入正确的电话号码!"
    }
  if (hintMsg != null) {
    wx.showToast({
      title: hintMsg,
      icon: 'loading',
      duration: 700
    })
  }
  }
})
// function firstStep() { // 提交电话号码，获取［验证码］  
//   if (!check.checkPhoneNum(phoneNum)||phoneNum.length!=11) {
//     hintMsg = "请输入正确的电话号码!"
//     return false;
//   }
//    if (webUtils.submitPhoneNum(phoneNum, "wanna")) {
//       hintMsg = null;
//       return true;
//     }
//   hintMsg = "提交错误，请稍后重试!"
//   return false;
// }
function secondStep() { // 提交［验证码］  
  if (!check.checkIsNotNull(identifyCode)) {
    hintMsg = "请输入验证码!"
    return false
  }
  if (webUtils.submitIdentifyCode(identifyCode)) {
    hintMsg = null
    return true
  }
  hintMsg = "提交错误，请稍后重试!"
  return false
}

function thirdStep() { // 提交［密码］和［重复密码］  
  console.log(password + "===" + rePassword)
  if (!check.isContentEqual(password, rePassword)) {
    hintMsg = "两次密码不一致！"
    return false;
  }
   return true;  
}
