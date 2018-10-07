function openid(){
  wx.request({
    url: "https://nh20i6qu.qcloud.la/weapp/login/index",
    data: {
      code: code,
      appid: "wx4362f44fb0b39bd9",
      secret: "b3254c5654c38040bf9d940f6eab1ab3",
    },
    success:function(res){
      var openid = res.data.openid
      return openid;
    }
  })
}
module.exports={
  openid:openid
}