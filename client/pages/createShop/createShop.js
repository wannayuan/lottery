var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var app=getApp();
Page({
  data:{
    tempFilePaths:[],  //图片路径列表
    count:0,  //图片数量
    login:"",  //申请店主的openID
    bianhao:"", //编号
    name:"",   //名称
    address:"",   //地址
    idcard:"",   //身份证号码
    phone:"",    //电话
    toastText:"",  //警告信息
  },
onLoad:function(options){
  var login=options.login;
  this.setData({
    login:login,
  })
},
//店铺信息
information:function(e){
  var type=e.currentTarget.dataset.data;
  var value = e.detail.value;
  if(type=="bianhao"){
  this.setData({
    bianhao:value
  })
  }else if(type=="name"){
    this.setData({
      name:value
    })
  }else if(type=="address"){
    this.setData({
      address:value
    })
  }else if(type=="idcard"){
    this.setData({
      idcard:value
    })
  }else if(type=="phone"){
    this.setData({
      phone:value
    })
  }
},
//添加图片
addPicture:function(){
  var that=this;
  wx.chooseImage({
    count:4, //
    success: function (res) {
      var tempFilePaths=that.data.tempFilePaths;
      var count=that.data.count+tempFilePaths.length;
      tempFilePaths.push(res.tempFilePaths[0]);
      console.log(tempFilePaths);
      that.setData({
        tempFilePaths:tempFilePaths,
        count:count,
      });
    }
  })
},
//提交店铺信息
confirm:function(){
  var that = this;
  var tempFilePaths=that.data.tempFilePaths[0];
  console.log(tempFilePaths);
  if(that.data.bianhao==""||that.data.name==""||that.data.address==""||that.data.phone==""||that.data.idcard==""||that.data.phone==""){
    that.setData({
      toastText:"请将信息填写完整!"
    });
    return;
  }
wx.uploadFile({
  url: 'https://nh20i6qu.qcloud.la/weapp/upload/index',
  filePath:tempFilePaths,
  name: 'file',
  success: function (res) {
    res=JSON.parse(res.data);
    var imgUrl=res.data.imgUrl;
    wx.request({
      url: "https://nh20i6qu.qcloud.la/weapp/Createshop/index",
      data: {
        bianhao: that.data.bianhao,
        name: that.data.name,
        address: that.data.address,
        IDcard: that.data.idcard,
        telphone: that.data.phone,
        openid: that.data.login,
        imgUrl:imgUrl,
      },
      success: function (res) {
        util.showSuccess('提交成功');
        wx.switchTab({
          url: '../wode/wode',
        })
      }
    })
  },
  fail: function (res) {
    util.showSuccess('提交失败');
  }
})
 
}
})