var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({
  data: {
    prizeState: 1,  //默认状态是未出票
    chupiao:[],   //未出票的号码
    login:"",
    tip:false,
    imgUrl:''
  },
onShow: function(){
  var that=this;
  var login=wx.getStorageSync("login");
  that.setData({
    login:login
  });
  wx.request({
    url:"https://nh20i6qu.qcloud.la/weapp/Chupiao/index",
    data:{
      openid:that.data.login,
      prizeState:that.data.prizeState
    },
    success:function(res){
      console.log(res.data);
      if(res.data.length==0){
        that.setData({
          chupiao:res.data,
          tip:true
        })
      }else{
        that.setData({
          chupiao:res.data,
          tip:false
        })
      }
    }
  });
  },
//改变查询方式
changeState:function(e){
  var that = this;
  var prizeState = e.currentTarget.dataset.prizestate;
  that.setData({
    prizeState: prizeState
  });
   wx.request({
     url:"https://nh20i6qu.qcloud.la/weapp/Chupiao/index",
    data: {
      openid:that.data.login,
      prizeState: that.data.prizeState
    },
    success: function (res) {
      console.log(res.data);
      if (res.data.length == 0) {
        that.setData({
          chupiao: res.data,
          tip: true
        })
      } else {
        that.setData({
          chupiao: res.data,
          tip: false
        })
      }
    }
  })
 },
// 上传图片接口
chupiao:function (e) {
  var that = this;
  var index=e.currentTarget.dataset.index;
  var id = e.currentTarget.dataset.data;
  // 选择图片
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      util.showBusy('正在上传')
      var filePath = res.tempFilePaths[0]
      // 上传图片
      wx.uploadFile({
        // url: config.service.uploadUrl,
        url:"https://nh20i6qu.qcloud.la/weapp/upload/index",
        filePath: filePath,
        name: 'file',
        success: function (res) {
          util.showSuccess('上传图片成功');
          res = JSON.parse(res.data);
          var chupiao = that.data.chupiao;
          for (var i = 0; i < chupiao.length; i++) {
            var temp = chupiao[i].id;
            if (temp == id) {
              chupiao[i] = { id:chupiao[i].id, state:chupiao[i].state, betnumber: chupiao[i].betnumber, imgUrl:res.data.imgUrl };
            } else {
              chupiao[i] = { id: chupiao[i].id, state:chupiao[i].state, betnumber: chupiao[i].betnumber, imgUrl: chupiao[i].imgUrl };
            }
          }
          that.setData({
            chupiao: that.data.chupiao,
          });
          console.log(that.data.chupiao);
          //更新数据库
          wx.request({
          url:"https://nh20i6qu.qcloud.la/weapp/updateimage/index",
            data: {
              id:id,
              imgUrl:res.data.imgUrl,
            },
            success: function (res) {
              util.showSuccess('出票成功');
              var chupiao=that.data.chupiao;
              for(var i=0;i<chupiao.length;i++){
                var temp=chupiao[i].id;
                if(temp==id){
                  chupiao[i]={ id:chupiao[i].id,state:0, betnumber:chupiao[i].betnumber,imgUrl:chupiao[i].imgUrl };
                }else{
                  chupiao[i] = { id: chupiao[i].id, state: 1, betnumber: chupiao[i].betnumber, imgUrl: chupiao[i].imgUrl  }; 
                }
              }
              that.setData({
                chupiao:chupiao
              })
              console.log(that.data.chupiao);
            }
          }) 
        },

        fail: function (e) {
          util.showModel('上传图片失败')
        }
      })

    },
    fail: function (e) {
      console.error(e)
    }
  })
},
// 预览图片
previewImg: function (e) {
  var index =e.currentTarget.dataset.index;
  wx.previewImage({
    current: this.data.chupiao[index].imgUrl,
    urls: [this.data.chupiao[index].imgUrl]
  })
},
})