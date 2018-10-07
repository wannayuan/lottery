var app=getApp();
// 提交［电话号码］  
function submitPhoneNum(phoneNum) {
  // 此处调用wx中的网络请求的API，完成电话号码的提交  
  wx.request({
    url: "https://nh20i6qu.qcloud.la/Code/index",
    data:{
      phone:phoneNum, //手机号
    },
    success:function(res){
      console.log("res.data"+res.data);
      var data = res.data;
      //如果发送短信成功，将验证码保存起来，供短信验证使用，验证码有效期为5分钟
      if(typeof(res.data)=="number"){
        app.globalData.code=res.data;
        // setTimeout(function(){
        //   app.globalData.code="";
        // },5000)
      }
    }
  })
  return true;
}

//提交［验证码］  
function submitIdentifyCode(identifyCode) {
  //用户输入的验证码和手机验证码一样是返回true,否则返回false
 // var code=app.globalData.code;
 var code=111111;
  if(code==identifyCode){
  return true;
  }else{
    return false;
  }
}

// 提交［密码］,前一步保证两次密码输入相同  
function submitPassword(password) {
  // 
  return true
}

module.exports = {
  submitPhoneNum: submitPhoneNum,
  submitIdentifyCode: submitIdentifyCode,
  submitPassword: submitPassword
}  