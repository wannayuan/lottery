
//app.js
App({
  onLaunch: function () {
    //获取授权信息
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: function () {
              // 用户已经同意小程序使用用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
              wx.getUserInfo({
                success: function (res) {
                  this.globalData.userInfo = res.userInfo
                  console.log(this.globalData.userInfo);
                }
              })
            },
            fail: function () {
              //拒绝授权给出提示框
              wx.showModal({
                title: '用户提示',
                content: "用户拒绝授权后，将不能享有购买彩票的能力，请在购买时授予权限或删除小程序重新进入购买",
              })
            }
          })
        } 
      }
    })
    //本地缓存是否保存有用户登录的唯一标识，如果有，赋值给全局变量login
    //当用户发起购买的时候，判断本地缓存中是否有登录标识（用户在数据库中是否有信息），
    //没有的话授权登录,并将后台返回的openid保存在本地缓存中供以后判断
    var value = wx.getStorageSync("login");
    if (value) {
      this.globalData.login = value;
    }
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      //调回调函数
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    ballsList: [],  //双色球的选球
    daletouBallsList:[],  //大乐透的选球
    qixingcaiBallsList:[], //七星彩的选球
    zhuijia:false,   //大乐透是否追加
    login: "", //保存用户登录的唯一标识openid
    code:"",   //手机短信验证码
    account: {
      "totalmoney": 0,
      "dongjiemoney": 0,
      "usemoney": 0,
    },
    History:"", //保存历史开奖信息
    shuangseqiuTime: [], //双色球开奖日期
    shuangseqiuRedballs: [], //双色球开奖红球号码
    shuangseqiuBlueballs: [], //双色球开奖蓝球号码
    shuangseqiuQihao: "",//双色球期号
    shuangseqiuInformation:"", //双色球开奖全部数据
    shuangseqiuXiaoliang:"",//双色球销量
    shuangseqiuJiangchi:"",//双色球奖池
    daletouInformation:[], //保存大乐透开奖信息
    qixingcaiInformation:[],//七星彩开奖详情
    daletouXiangqing:[] ,//大乐透开奖详情,保存开奖表单信息
    shuangHemai:[], //双色球合买详情
    daletouHemai:[], //大乐透合买详情
    qixingcaiHemai:[] , //七星彩合买详情
    dangQi:"2017137",   //购买彩票的最新期号
    shopInformation:"",
    zhongjiang:[],     //中奖信息
  }
})
