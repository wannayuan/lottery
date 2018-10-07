Page({
data:{
 shop:[],//申请店铺的名单
 tip:false, //提示信息
},
onShow:function(){
  var that=this;
  wx.request({
    url:"https://nh20i6qu.qcloud.la/weapp/manageapply/index",
   success:function(res){
    if(res.data.length==0){
      that.setData({
        shop:res.data,
        tip:true
      })
    }else{
      that.setData({
        shop:res.data,
        tip:false
      })
    }
   }
 })
},
//创建店铺
createShop: function (e) {
  var login=e.currentTarget.dataset.data;
  wx.navigateTo({
    url: '../createShop/createShop?login='+login,
  })
},
})