var app=getApp();
Page({
  data:{
   name:"" ,//用户真实姓名
   IDcard:"",//用户的身份证号
   phoneNumber:"",//用户的电话号码
   nameText:"",
   IDcardText:"",
   phoneNumberText:"",
   toastText:"" ,//弹框提示信息
   information:{}, //用户信息，完善资料后保存在缓存中，便于下次完善或者修改时使用
   sessionKey:"",
  },
onShow:function(){
  var that = this;
  var information=wx.getStorageSync("information");
  if(information!==""){
    this.setData({
      name: information.realname,
      IDcard: information.IDcard,
      phoneNumber: information.telphone
    })
  }
  var login=wx.getStorageInfoSync("login");
  if(!login){
    wx.login({
      success: function (res) {
        var code = res.code;
        if (code) {
          wx.request({
            url: "https://nh20i6qu.qcloud.la/weapp/login/index",
            data: {
              code: code,
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
                  nickName:app.globalData.userInfo.nickName,
                  openid: openid,
                },
                success:function (res) {
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
            }
          })
        }
      }
    })
  }
},
//获取用户的手机号
getPhoneNumber:function(e){
  var that=this;
  //用户允许授权
  if (e.detail.errMsg =="getPhoneNumber:ok"){
    console.log("session_key"+this.data.sessionKey);
    //使用加密算法获取用户的手机号码
    wx.request({
      url: "http://www.delewu.com:81/php/demo.php",
      data:{
        sessionKey:this.data.sessionKey,
        appid:"wxb070fa9e0538cf35",
        encryptedData: e.detail.encryptedData,
        iv:e.detail.iv,
      },
      success:function(res){
        var phoneNumber=res.data.substr(20,11);
        console.log("phoneNumber" +phoneNumber);
            that.setData({
              phoneNumber:phoneNumber,
              phoneNumberText: "",
            })
      }
    })
  }
  //用户拒绝授权
  if (e.detail.errMsg == "getPhoneNumber:fail user deny"){
   
  }
},
//获取用户的身份证号
IDcard:function(e){
 var value=e.detail.value;
 if(value!==""){
   if(value.length!="18")
   {
     this.setData({
       IDcardText:"身份证格式填写不正确",
     })
   }else{
     this.setData({
       IDcard: value,
       IDcardText: ""
     })
   }
 }else{
  this.setData({
    IDcardText:"身份证号不能为空",
  })
 }
},
//获取用户的真实姓名
name:function(e){
  var value = e.detail.value;
  if (value !== "") {
    this.setData({
      name: value,
      nameText:"",
    })
  }else{
    this.setData({
      nameText:"用户姓名不能为空"
    })
  }
},
//获取用户的电话号码
phoneNumber:function(e){
  var value = e.detail.value;
  if (value !== "") {
    if(value.length!=11){
      this.setData({
        phoneNumberText:"号码格式填写不正确",
      })
    }else{
      this.setData({
        phoneNumber: value,
        phoneNumberText: "",
      })
    }
  }else{
    this.setData({
      phoneNumberText:"电话号码不能为空",
    })
  }
},
information:function(){
  var that=this;
  wx.showModal({
    title: '提示',
    content: '请填写真实信息，并确保无误，由于信息有误无法正常兑奖情况本平台概不负责',
    cancelText:"修改信息",
    confirmText:"确认提交",
    success:function(){
      var name=that.data.name;
      var idcard=that.data.IDcard;
      var phoneNumber=that.data.phoneNumber;
      var nameText=that.data.nameText;
      var IDcardText=that.data.IDcardText;
      var phoneNumberText=that.data.phoneNumberText;
      if(name==""||idcard==""||phoneNumber==""){
        //提示用户信息填写完整再提交
        that.data.toastText = "请将信息填写完整后再提交";
        that.setData({
          toastText: that.data.toastText,
        })
      }
      if(nameText!=""||IDcardText!=""||phoneNumberText!=""){
        //提示用户信息填写不正确，重新填写后再提交
        that.data.toastText = "信息填写不正确，请重新填写";
        that.setData({
          toastText: that.data.toastText,
        })
      }
      if(that.data.toastText!=""){
        //2秒后弹框消失
        setTimeout(function () {
          that.data.toastText = "";
          that.setData({
            toastText: that.data.toastText,
          })
        }.bind(that), 2000);
        return;
      }
      wx.request({
        url:"https://nh20i6qu.qcloud.la/weapp/updateuser/index",
        data:{
          realname:that.data.name,
          IDcard:that.data.IDcard,
          telphone:that.data.phoneNumber,
          openid:app.globalData.login,
        },
        success:function(res){
          var information={"realname":that.data.name,"IDcard":that.data.IDcard,"telphone":that.data.phoneNumber};
          //将资料信息保存在缓存中
          wx.setStorageSync("information",information);
          //弹框提示修改资料成功
          that.data.toastText = "保存成功";
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
      })
    }
  })
}
})