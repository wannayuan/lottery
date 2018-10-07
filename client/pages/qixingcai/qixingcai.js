// shuangseqiu
var app = getApp();
var qixingcai=[];
for(var j=0;j<7;j++){
  qixingcai[j]=[];
for (var i = 0; i <= 9; i++) {
  var text=i;
  qixingcai[j].push({changeColor: true, text: text });
  } 
}
Page({
  data: {
    warning: false,
    warningText: "",
    totalZhushu: 0,
    totalMoney: 0,
    jixuan: false,//机选的二级按钮
    qixingcai:qixingcai,
    select:[[],[],[],[],[],[],[]],
  },

  onLoad: function (options) {
    var that=this;
    var select= JSON.parse(options.changeballs).balls;
    for(var i=0;i<that.data.qixingcai.length;i++){
      for(var j=0;j<that.data.qixingcai[i].length;j++){
        var text=that.data.qixingcai[i][j].text;
        for(var k=0;k<select[i].length;k++){
          if(select[i][k]==text){
            this.data.qixingcai[i][j]={"changeColor":false,"text":text};
          }
        }
      }  
    }
    that.setData({
      qixingcai:that.data.qixingcai,
      select:select,
    })
  },
  // 改变红球颜色
  changecolorR: function (e) {
    var index = e.currentTarget.dataset.index;
    var newarray= [[],[],[],[],[],[],[]];
    var select =this.data.select;
    var hemai = true;
    var ballNumber = 0;
    for(var j=0;j<this.data.qixingcai.length;j++){
      if(index==j){
        for (var i = 0; i < this.data.qixingcai[index].length; i++) {
          if (e.currentTarget.dataset.id == this.data.qixingcai[index][i].text) {
            // 该数字被选中，颜色改变，并且将选中数字添加到selectRed
            if (this.data.qixingcai[index][i].changeColor == true) {
              newarray[index][i] = { changeColor: false, text: this.data.qixingcai[index][i].text };
              select[index].push(this.data.qixingcai[index][i].text);
            }
            else {
              newarray[index][i] = { changeColor: true, text: this.data.qixingcai[index][i].text };
              select[index].pop(this.data.qixingcai[index][i].text);
            }
          } else {
            newarray[index][i] = { changeColor: this.data.qixingcai[index][i].changeColor, text: this.data.qixingcai[index][i].text };
          }
        }
      }else{
        newarray[j]=this.data.qixingcai[j];
        select[j]=this.data.select[j];
      }
    }
    for (var i = 0; i <select.length; i++) {
      ballNumber+=select[i].length;
      if (select[i].length < 1) {
        hemai = false;
        break;
      }
    }
    if(hemai){
      if(this.data.warning==true){
        this.data.warning=false;
        this.data.warningText="";
      }
      this.data.totalZhushu = Math.pow(2, (ballNumber - 7));
      this.data.totalMoney = this.data.totalZhushu * 2;
    }else{
      this.data.totalZhushu="";
      this.data.totalMoney="";
    }
    this.setData({
      qixingcai: newarray,
      select:select,
      totalZhushu: this.data.totalZhushu,
      totalMoney: this.data.totalMoney,
      warning: this.data.warning,
      warningText: this.data.warningText,
    })
  },
  //发起合买
  hemai: function () {
    var hemai=true;
    for(var i=0;i<this.data.select.length;i++){
      if(this.data.select[i].length<1){
      hemai=false;
      break;
      }
    }
   if(hemai){
     app.globalData.qixingcaiBallsList.unshift({ "balls": this.data.select, "totalZhushu": this.data.totalZhushu, "totalMoney": this.data.totalMoney });
     wx.navigateTo({
       url: '../touzhu/touzhu?lotteryType=qixingcai',
     })
   }else{
      this.setData({
        warningText: "每一位至少选择一个球",
        warning: true
      })
    }
  },

  //计算n的阶乘
  jiecheng: function (n) {
    if (n == 1 || n == 0) {
      return 1;
    } else {
      return n * this.jiecheng(n - 1);
    }
  },

  //机选
  jixuan: function () {
    if (this.data.jixuan === false) {
      this.data.jixuan = true
    } else {
      this.data.jixuan = false
    }
    this.setData({
      jixuan: this.data.jixuan
    })
  },

  //随机产生一个0-n的随机数
  Random: function (n) {
    return Math.ceil(Math.random() * n);
  },

  //随机产生n注号码
  randomNumber: function (e) {
    var n = e.currentTarget.dataset.data;
    //外循环控制产生几注机选号码，内循环产生一组随机号码
    for (var j = 0; j <n; j++) {
      var select = [[], [], [], [], [], [], []];
      //随机生成n注七星彩号码
      for (var i = 0; i < 7; i++) {
        select[i].push(this.Random(9));
      }
      app.globalData.qixingcaiBallsList.unshift({ "balls": select, "totalZhushu": 1, "totalMoney": 2 });
    }
    wx.navigateTo({
      url: '../touzhu/touzhu?lotteryType=qixingcai'
    })
  }
})
