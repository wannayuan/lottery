var app = getApp();
Page({
  data: {
    hemai: [],  //合买信息
    copies: 1,  //合买份数
    warningText: "", //提示信息
    buyMoney: 0,  //购买金额
  },
  onLoad: function (option) {
    var index = option.index;
    var type = option.type;
    if (type == "双色球") {
      var hemai = app.globalData.shuangHemai[index];
      this.setData({
        hemai: hemai,
      })
    } else if (type == "大乐透") {
      var hemai = app.globalData.daletouHemai[index];
      this.setData({
        hemai: hemai,
      })
    } else if (type == "七星彩") {
      var hemai=app.globalData.qixingcaiHemai[index];
      this.setData({
        hemai: hemai,
      })
    }
  },
  //input事件
  inputblur: function (e) {
    var copies = e.detail.value;
    this.setData({
      copies: copies,
    })
  },
  //确认购买
  goShop: function (e) {
    var that = this;
    var cid = e.currentTarget.dataset.cid;
    if (this.data.copies > this.data.hemai.lastcopies) {
      this.setData({
        warningText: "不得大于剩余份数",
        copies: this.data.hemai.lastcopies,
      })
      return;
    } else if (this.data.copies <= 0 || this.data.copies == "") {
      this.setData({
        warningText: "请输入合法数据",
        copies: 1
      })
      return;
    } else {
      var hemai=this.data.hemai;
      var buyMoney=hemai.totalmoney * this.data.copies/hemai.copies;
      this.setData({
        warningText: "",
        buyMoney: buyMoney,
      })
    }
    app.globalData.shopInformation=this.data.hemai;
    app.globalData.shopInformation['shopcopies']=this.data.copies;
    app.globalData.shopInformation['totalmoney']=this.data.buyMoney;
    wx.navigateTo({
      url: '../chongzhi/chongzhi?event=chemai'+"&hemai=" + app.globalData.shopInformation+"&money="+buyMoney,
    })
  }
})