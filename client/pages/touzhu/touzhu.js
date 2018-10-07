var check = require("../../utils/check.js")
var webUtils = require("../../utils/registerWebUtil.js")
var app=getApp();
var arrayRed = [];
var arrayBlue = [];
for (var i = 1; i <= 35; i++) {
  var text;
  if (i < 10) {
    text = "0" + i;
  } else {
    text = i;
  }
  arrayRed.push({ changeColor: true, text: text });
  if (i < 17) {
    arrayBlue.push({ changeColor: true, text: text });
  }
}
Page({
  data:{
   selectRed:"",   //选择的红球
   selectBlue:"",  //选择的蓝球
   totalZhushu:0, //总注数
   totalMoney:0,  //总金额
   minTotalMoney:2, //发起合买的最小的总金额，最小为2
   multiple:1,    //倍数
   copyNumber:2,  //发起合买的份数
   minCopyNum:1,   //每份最小金额
   eachMoney:0,   //每份的金额
   baodiMoney:0.00,    //保底金额
   baodiPercent:0,    //保底比例
   baodiCopies:1,    //保底份数，至少1份，小于发起合买的份数
   baodiList:[],     //保存保底金额的数组
   scroll:true,
   shopValue: "选择投注站出票",
   showModalStatus: false,  //是否显示模态窗口
   ballsList:[],           //保存所有选号
   arrayRed: arrayRed,     //随机生成红球号码
   arrayBlue: arrayBlue,   //随机生成蓝球号码  
   baodi:false,            //控制保底方式
   warningMultiple:false,  //投注倍数是否有警告
   warningPercent:false,   //比例是否有警告
   warningMoney:false,     //金额是否有警告
   warningbaodiCopies:false,    //保底份数是否有警告
   warningcopyNumber:false,  //发起合买的份数是否有警告
   multipleText:"",        //投注倍数警告信息
   percentText:"",         //比例警告信息
   moneyText:"",           //金额警告信息
   baodiCopiesText:"",     //保底份数警告信息
   copyNumberText:"",      //发起合买的份数的提示信息
   shopMethod:true,       //判断当前购买方式，默认为自己买
   methodText: "发起合买", //购买彩票的方式，默认为自己买
   userInfo:{},          //用户信息
   ballNumber:"",        //数组转换成字符串
   isShowToast:false,    //是否显示弹出窗口
   toastText:"",         //弹出窗口提示信息
   session:"",           //保存登录信息,用户登录的唯一标识，即openid
   IDCardStatus:false ,   //控制完善个人资料的窗口
   event:"",             //保存发起购买的方式
   dangQi:"",            //当期购买的期号
   lotteryType:"",       //投注彩票类型
   zhuijia:"",           //大乐透发起购买时是否追加，只有自己购买时才能追加
   eachArray:[],         //保存每组选球的金额
   caipiaozhan:[],       //入驻的彩票站
  },
onLoad:function(option){
 var that=this;
 var lotteryType=option.lotteryType;
  this.setData({
   lotteryType:lotteryType,
   zhuijia:app.globalData.zhuijia,
 });
 //获取入驻彩票站
 wx.request({
   url:"https://nh20i6qu.qcloud.la/weapp/Station/index",
   success:function(res){
     console.log("获取的彩票站",res.data);
     that.setData({
       caipiaozhan:res.data
     })
   }
 })
},
onShow:function(){
  //获取用户信息
  var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  if(this.data.lotteryType=="shuangseqiu"){
    that.setData({
      ballsList: app.globalData.ballsList,
    })
  }else if(this.data.lotteryType=="daletou"){
    that.setData({
      ballsList: app.globalData.daletouBallsList,
    })
  }else if(this.data.lotteryType=="qixingcai"){
    that.setData({
      ballsList:app.globalData.qixingcaiBallsList,
    })
  }
  console.log(that.data.ballsList);
  this.show();
  this.baodiMoney();
},
//计算总注数和总金额
show:function(){
  if(this.data.lotteryType=="shuangseqiu"){
    var ballsList = app.globalData.ballsList;
  }else if(this.data.lotteryType=="daletou"){
    var ballsList = app.globalData.daletouBallsList;
  }else if(this.data.lotteryType=="qixingcai"){
    var ballsList=app.globalData.qixingcaiBallsList;
  }
  console.log(ballsList);
  if (this.data.lotteryType=="qixingcai"){

  }else{
    for(var i=0;i<ballsList.length;i++){
      var redballs=ballsList[i].redballs;
      var blueballs=ballsList[i].blueballs;
      var newred=this.maopao(redballs);
      var newblue=this.maopao(blueballs);
      ballsList[i].redballs=newred;
      ballsList[i].blueballs=newblue;
    }
  }
    var totalZhushu=0;
    var totalMoney=0;
    var array=[];
    for (var i = 0;i<ballsList.length;i++){
      totalZhushu+=ballsList[i].totalZhushu;
      if(this.data.zhuijia){
        totalMoney+=ballsList[i].totalMoney+ballsList[i].totalZhushu;
      }else{
        totalMoney += ballsList[i].totalMoney;
      }
      if(this.data.zhuijia){
        array.push(ballsList[i].totalMoney+ballsList[i].totalZhushu);
      }else{
        array.push(ballsList[i].totalMoney);
      }
     
    }
    totalMoney=totalMoney*this.data.multiple;
    array=this.maopao(array);
     //每份的金额，保留两位小数，返回的是一个字符串
    var eachMoney=(array[0]/this.data.copyNumber).toFixed(2);
    //将所需数据保存到data中
   this.setData({
     totalZhushu:totalZhushu,
     totalMoney:totalMoney,    
     eachMoney:eachMoney,
     ballsList:ballsList,
     minTotalMoney:array[0],
     eachArray:array,
    })
},
//冒泡排序(从小到大冒泡排序),求最小的合买总金额
maopao:function(array){
  var temp;
  for(var i=0;i<array.length;i++){
    for(var j=0;j<i;j++){
      if(array[i]<array[j]){
        temp=array[i];
        array[i]=array[j];
        array[j]=temp;
      }
    }
  }
  return array;
},
//大乐透是否追加
checkboxChange:function(e){
 if(e.detail.value[0]=="true"){
   var totalMoney=0;
   for(var i=0;i<this.data.ballsList.length;i++){
     totalMoney+=this.data.ballsList[i].totalMoney +this.data.ballsList[i].totalZhushu;
   }
    totalMoney=totalMoney*this.data.multiple;
   app.globalData.zhuijia = true;
   this.setData({
     zhuijia:true,
     totalMoney:totalMoney,
   })
   this.baodiMoney();
 }else{
   var totalMoney=0;
   for (var i = 0; i < this.data.ballsList.length; i++) {
     totalMoney += this.data.ballsList[i].totalMoney;
   }
   totalMoney = totalMoney* this.data.multiple;
   app.globalData.zhuijia=false;
   this.setData({
     zhuijia:false,
     totalMoney:totalMoney,
   })
   this.baodiMoney();
 }
},
//减操作
sub:function(e){
  var type=e.currentTarget.dataset.data;
 if(type=="multiple"){
   var multiple = this.data.multiple;
   multiple--;
   if (multiple <1) {
     multiple = 1;
   }
   if(this.data.zhuijia){
    var money=0;
    for(var i=0;i<this.data.ballsList.length;i++){
      money+=this.data.ballsList[i].totalMoney+this.data.ballsList[i].totalZhushu;
    }
     money=money*multiple;
   }else{
     var money = this.data.totalZhushu * multiple * 2;
   }
  // var eachMoney = (money / this.data.copyNumber).toFixed(2);
   this.setData({
     multiple: multiple,
     totalMoney: money,
     warningMultiple:false,
     multipleText:"",
   //  eachMoney: eachMoney,
   })
   //计算应支付的保底金额
   this.baodiMoney();

 } else if(type =="copyNumber"){
   var copy = this.data.copyNumber;
   copy--;
   //发起合买的份数至少为2份
   if (copy <2) {
     copy = 2;
     this.data.warningcopyNumber = true;
     this.data.copyNumberText = "发起合买至少要2份";
   }else {
     this.data.warningcopyNumber = false;
     this.data.copyNumberText = "";
   }
 //  var eachMoney = (this.data.minTotalMoney/ copy).toFixed(2);
   this.setData({
     copyNumber: copy,
     warningcopyNumber: this.data.warningcopyNumber,
     copyNumberText:this.data.copyNumberText,
    // eachMoney: eachMoney,
   })
   //计算应支付的保底金额
   this.baodiMoney();
   setTimeout(function(){
     this.setData({
      warningcopyNumber:false,
       copyNumberText:"",
     })
   }.bind(this),1500);

 } else if(type =="baodiPercent"){
    var percent=this.data.baodiPercent;
    percent--;
    if(percent<=0){
      percent=0;
    }
    var baodiMoney=(this.data.totalMoney*percent/100).toFixed(2);
    this.setData({
      baodiPercent:percent,
      baodiMoney:baodiMoney,
    })
 } else if (type =="baodiMoney"){
   var money=this.data.baodiMoney;
   money--;
   if(money<=0){
     money=0;
   }
   this.setData({
     baodiMoney:money,
   })
 } else if (type =="baodiCopies"){
   var baodiCopies = this.data.baodiCopies;
   baodiCopies--;
   if (baodiCopies<1){
     baodiCopies=1;
     this.data.warningbaodiCopies=true;
     this.data.baodiCopiesText = "至少保底1份";
   }else{
     this.data.warningbaodiCopies=false;
     this.data.baodiCopiesText="";
   }
   this.setData({
     baodiCopies: baodiCopies,
     warningbaodiCopies:this.data.warningbaodiCopies,
     baodiText:this.data.baodicopiesText,
   })
   //计算应支付的保底金额
   this.baodiMoney();
   setTimeout(function () {
     this.setData({
       warningbaodiCopies: false,
       baodiCopiesText: "",
     })
   }.bind(this), 1500);
 }
},
//加操作
add:function(e){
  var type = e.currentTarget.dataset.data;
  if(type=="multiple"){
    var multiple = this.data.multiple;
    multiple++;
    if(multiple>99){
      multiple--;
      this.data.warningMultiple=true;
      this.data.multipleText="投注倍数不能超过99倍";
    }else{
      this.data.warningMultiple=false;
      this.data.multipleText="";
    }
    if (this.data.zhuijia) {
      var money = 0;
      for (var i = 0; i < this.data.ballsList.length; i++) {
        money += this.data.ballsList[i].totalMoney + this.data.ballsList[i].totalZhushu;
      }
      money = money * multiple;
    } else {
      var money = this.data.totalZhushu * multiple * 2;
    }
  //  var eachMoney = (money / this.data.copyNumber).toFixed(2);
    this.setData({
      multiple: multiple,
      totalMoney: money,
      warningMultiple:this.data.warningMultiple,
      multipleText:this.data.multipleText,
     // eachMoney: eachMoney,
    })
    //计算应支付的保底金额
    this.baodiMoney();
    setTimeout(function () {
      this.setData({
        warningMultiple: false,
        multipleText: "",
      })
    }.bind(this), 1500);

  } else if (type =="copyNumber"){
    var copy = this.data.copyNumber;
    copy++;
    //发起合买的最小每份的最小金额
    if ((this.data.minTotalMoney / copy).toFixed(2) < this.data.minCopyNum) {
      copy--;
      this.data.warningcopyNumber = true;
      this.data.copyNumberText = "发起合买的单份最小金额为"+this.data.minCopyNum+"元";
    }else{
      this.data.warningcopyNumber = false;
      this.data.copyNumberText = "";
    }
  //  var eachMoney = (this.data.minTotalMoney/ copy).toFixed(2);
    this.setData({
      copyNumber: copy,
      warningcopyNumber:this.data.warningcopyNumber,
      copyNumberText:this.data.copyNumberText,
    //  eachMoney: eachMoney,
    })
    //计算应支付的保底金额
    this.baodiMoney();
    setTimeout(function () {
      this.setData({
        warningcopyNumber: false,
        copyNumberText: "",
      })
    }.bind(this), 1500);

  } else if(type =="baodiPercent"){
    var percent=this.data.baodiPercent;
    percent++;
    if(percent>100){
      percent=100;
    }
    var baodiMoney=(this.data.totalMoney*percent/100).toFixed(2);
    this.setData({
      baodiMoney:baodiMoney,
      baodiPercent:percent,
    })
  } else if(type =="baodiMoney"){
    var money=this.data.baodiMoney;
    money++;
    if(money>this.data.totalMoney){
      money=this.data.totalMoney;

    }
    this.setData({
      baodiMoney:money,
    })
  } else if (type =="baodiCopies"){
    var baodiCopies = this.data.baodiCopies;
    baodiCopies++;
    //边缘值做容错处理，如果保底份数大于发起合买的份数，则最大保底份数为发起合买的份数
    if (baodiCopies>this.data.copyNumber){
      baodiCopies=this.data.copyNumber;
      this.data.warningbaodiCopies = true;
      this.data.baodiCopiesText = "保底分数不能大于发起合买的份数";
    }else{
      this.data.warningbaodiCopies = false;
      this.data.baodiCopiesText = "";
    }
    this.setData({
      baodiCopies:baodiCopies,
      warningbaodiCopies:this.data.warningbaodiCopies,
      baodiCopiesText:this.data.baodiCopiesText,
    })
    //计算应支付的保底金额
    this.baodiMoney();
    setTimeout(function () {
      this.setData({
        warningbaodiCopies: false,
        baodiCopiesText: "",
      })
    }.bind(this), 1500);
  }
},
//手动输入倍数和份数
changeinput:function(e){
 var type = e.currentTarget.dataset.data;
 if(type=="multiple"){
   var multiple=e.detail.value;
      if(multiple==""){
     return;
   }
   //向下容错
     if (multiple < 1) {
        multiple = 1;
      }
   //向上容错
      if (multiple > 99) {
        multiple=99;
        this.data.warningMultiple = true;
        this.data.multipleText = "投注倍数不能超过99倍";
      } else {
        this.data.warningMultiple = false;
        this.data.multipleText = "";
      }
      if (this.data.zhuijia) {
        var money = 0;
        for (var i = 0; i < this.data.ballsList.length; i++) {
          money += this.data.ballsList[i].totalMoney + this.data.ballsList[i].totalZhushu;
        }
        money = money * multiple;
      } else {
        var money = this.data.totalZhushu * multiple * 2;
      }
 //  var eachMoney = (money / this.data.copyNumber).toFixed(2);
   this.setData({
     multiple: multiple,
     totalMoney: money,
     warningMultiple: this.data.warningMultiple,
     multipleText: this.data.multipleText,
    // eachMoney: eachMoney,

   })
   //计算应支付的保底金额
   this.baodiMoney();
   setTimeout(function () {
     this.setData({
       warningMultiple: false,
       multipleText: "",
     })
   }.bind(this), 1500);

 }else if(type=="copyNumber"){
   var copy=e.detail.value;
   if(copy==""){
     return;
   }
   if (copy <=0) {
     copy = 2;
     this.data.warningcopyNumber = true;
     this.data.copyNumberText = "发起合买至少要2份";
   } else {
     this.data.warningcopyNumber = false;
     this.data.copyNumberText = "";
   }
   //var eachMoney = (this.data.minTotalMoney / copy).toFixed(2);
   this.setData({
     copyNumber: copy,
    // eachMoney: eachMoney,
     warningcopyNumber: this.data.warningcopyNumber,
     copyNumberText: this.data.copyNumberText,
   })
   //计算应支付的保底金额
   this.baodiMoney();
   setTimeout(function () {
     this.setData({
       warningcopyNumber: false,
       copyNumberText: "",
     })
   }.bind(this), 1500);

 }else if(type =="baodiPercent"){
   var percent=e.detail.value;
   if(percent==""){
     return;
   }
   if(percent>=0&&percent<=100){
   var baodiMoney = (this.data.totalMoney * percent / 100).toFixed(2);
   this.data.warningPercent = false;
   this.data.percentText = "";
   }else{
   percent=0;
   this.data.warningPercent = true;
   this.data.percentText = "比例不能超过100%";
   var baodiMoney=0.00;
   }
   this.setData({
     baodiMoney: baodiMoney,
     baodiPercent: percent,
     warningPercent: this.data.warningPercent,
     percentText:this.data. percentText,
   })
 } else if(type =="baodiMoney"){
   var money=e.detail.value;
   if (money == "") {
     return;
   }
   if(money>this.data.totalMoney){
     money=this.data.totalMoney;
     this.data.warningMoney=true;
     this.data.moneyText="保底金额不能超过总金额";
   }else{
     this.data.warningMoney = false;
     this.data.moneyText = "";
   }
   this.setData({
     baodiMoney:money,
     warningMoney:this.data.warningMoney,
     moneyText:this.data.moneyText,
   })
 } else if (type =="baodiCopies"){
   var baodiCopies=e.detail.value;
   if (baodiCopies==""){
     return;
   }
   if (baodiCopies > this.data.copyNumber||baodiCopies<1){
     if(baodiCopies>this.data.copyNumber){
       baodiCopies = this.data.copyNumber;
       this.data.baodiCopiesText = "保底分数不能大于发起合买的份数";
     }else if(baodiCopies<1){
       baodiCopies =1;
       this.data.baodiCopiesText = "至少保底1份";
     }
     this.data.warningbaodiCopies=true;
   }else{
     this.data.warningbaodiCopies = false;
     this.data.baodiCopiesText="";
   }
   this.setData({
     baodiCopies:baodiCopies,
     warningbaodiCopies: this.data.warningbaodiCopies ,
     baodiCopiesText: this.data.baodiCopiesText,
   })
   //计算应支付的保底金额
   this.baodiMoney();
   setTimeout(function () {
     this.setData({
       warningbaodiCopies: false,
       baodiCopiesText: "",
     })
   }.bind(this), 1500);
 }
},
//失去焦点,控制加倍或者份数是否为空或者输入不合法，否则进行处理
inputblur:function(e){
  var type = e.currentTarget.dataset.data;
  if(type=="multiple"){
    var multiple = e.detail.value;
    if(multiple!=""&&multiple>0){
       return;
    }else{
      multiple=1;
      if (this.data.zhuijia) {
        var money = 0;
        for (var i = 0; i < this.data.ballsList.length; i++) {
          money += this.data.ballsList[i].totalMoney + this.data.ballsList[i].totalZhushu;
        }
        money = money * multiple;
      } else {
        var money = this.data.totalZhushu * multiple * 2;
      }
     // var eachMoney = (money / this.data.copyNumber).toFixed(2);
      this.setData({
        multiple: multiple,
        totalMoney: money,
      //  eachMoney: eachMoney,
      })
      //计算应支付的保底金额
      this.baodiMoney();
    }
  }else if(type=="copyNumber"){
    var copy = e.detail.value;
    //向下容错
    if (copy < 2) {
      copy = 2;
      this.data.warningcopyNumber = true;
      this.data.copyNumberText = "发起合买至少要2份";
    } else {
      this.data.warningcopyNumber = false;
      this.data.copyNumberText = "";
    }
    if ((this.data.minTotalMoney / copy).toFixed(2) < this.data.minCopyNum) {
      copy=2;
      this.data.warningcopyNumber = true;
      this.data.copyNumberText = "发起合买的单份最小金额为" + this.data.minCopyNum + "元";
    } else {
      this.data.warningcopyNumber = false;
      this.data.copyNumberText = "";
    }
    this.setData({
      copyNumber: copy,
      warningcopyNumber: this.data.warningcopyNumber,
      copyNumberText: this.data.copyNumberText,
      //  eachMoney: eachMoney,
    })
     // var eachMoney = (this.data.totalMoney / copy).toFixed(2);
     
      //计算应支付的保底金额
      this.baodiMoney();
      setTimeout(function () {
        this.setData({
          warningcopyNumber: false,
          copyNumberText: "",
        })
      }.bind(this), 1500);
    
  }else if(type=="baodiPercent"){
     var percent=e.detail.value;
     if(percent!=""){
       return;
     }else{
       percent=0;
       var baodiMoney = (this.data.totalMoney * percent / 100).toFixed(2);
       this.setData({
         baodiMoney: baodiMoney,
         baodiPercent: percent,
       })
     }
  }else if(type=="baodiMoney"){
    var money=e.detail.value;
    if(money!=""&&money>0){
      return;
    }else{
      money=0;
      this.setData({
        baodiMoney:money,
      })
    }
  } else if (type =="baodiCopies"){
    var baodiCopies=e.detail.value;
    if (baodiCopies != "" && baodiCopies>=2){
      return;
    }else{
      baodiCopies=2;
      this.setData({
        baodiCopies: baodiCopies,
      })
      //计算应支付的保底金额
      this.baodiMoney();
    }
  }
},
//计算合买时的应支付保底金额
baodiMoney:function(){
  if(this.data.lotteryType=="shuangseqiu"){
    this.setData({
      ballsList: app.globalData.ballsList,
    })
  }else if(this.data.lotteryType=="daletou"){
    this.setData({
      ballsList: app.globalData.daletouBallsList,
    })
  }else if(this.data.lotteryType=="qixingcai"){
    this.setData({
      ballsList:app.globalData.qixingcaiBallsList,
    })
  }
  var baodiMoney=0;
  //合买时应支付的保底金额等于多注合买每份的金额乘以保底份数之和
  for (var i = 0;i<this.data.ballsList.length;i++){
    //每一注合买的保底金额
    if(this.data.zhuijia){
      var eachMoney = ((this.data.ballsList[i].totalZhushu * 2 +this.data.ballsList[i].totalZhushu)*this.data.multiple  * this.data.baodiCopies / this.data.copyNumber);
    }else{
      var eachMoney = (this.data.ballsList[i].totalZhushu * this.data.multiple * 2 * this.data.baodiCopies / this.data.copyNumber);
    }
    this.data.baodiList.push(eachMoney);
    baodiMoney+=eachMoney;
  }
  baodiMoney=baodiMoney.toFixed(2);
  this.setData({
    baodiMoney:baodiMoney,
  })
},
powerDrawer: function (e) {
  var currentStatu = e.currentTarget.dataset.statu;
  this.util(currentStatu)
},
util: function (currentStatu) {
    //关闭 
    if (currentStatu == "close") {
      this.setData(
        {
          showModalStatus: false
        }
      );
    }
  // 显示 
  if (currentStatu == "open") {
    this.setData(
      {
        showModalStatus: true
      }
    );
  }
},
radiochange:function(e){
  console.log("选中项的value:"+e.detail.value);
  this.setData({
    shopValue:e.detail.value
  })
} ,
clearballs:function(e){
  var id=e.currentTarget.dataset.id;
  if(this.data.lotteryType=="shuangseqiu"){
    app.globalData.ballsList.splice(id, 1);
    this.setData({
      ballsList: app.globalData.ballsList,
    })
  }else if(this.data.lotteryType=="daletou"){
    app.globalData.daletouBallsList.splice(id, 1);
    this.setData({
      ballsList: app.globalData.daletouBallsList,
    })
  }else if(this.data.lotteryType=="qixingcai"){
    app.globalData.qixingcaiBallsList.splice(id,1);
    this.setData({
      ballsList:app.globalData.qixingcaiBallsList,
    })
  }
  this.show();
  this.baodiMoney();
  },
changeballs:function(e){
  var id = e.currentTarget.dataset.id;
  if(this.data.lotteryType=="shuangseqiu"){
    var changeball = app.globalData.ballsList[id];
    app.globalData.ballsList.splice(id, 1);
    wx.navigateTo({
      url: '../shuangseqiu/shuangseqiu?changeballs=' + JSON.stringify(changeball),
    })
  }else if(this.data.lotteryType=="daletou"){
    var changeball = app.globalData.daletouBallsList[id];
    app.globalData.daletouBallsList.splice(id, 1);
    wx.navigateTo({
      url: '../daletou/daletou?changeballs=' + JSON.stringify(changeball),
    })
  }else if(this.data.lotteryType=="qixingcai"){
    var changeball=app.globalData.qixingcaiBallsList[id];
    app.globalData.qixingcaiBallsList.splice(id,1);
    wx.navigateTo({
      url: '../qixingcai/qixingcai?changeballs='+JSON.stringify(changeball),
    })
  }
  
},
//继续选号
moreBalls:function(){
 if(this.data.lotteryType=="shuangseqiu"){
   wx.navigateTo({
     url: '../shuangseqiu/shuangseqiu',
   })
 }else if(this.data.lotteryType=="daletou"){
   wx.navigateTo({
     url: '../daletou/daletou',
   })
 }else if(this.data.lotteryType=="qixingcai"){
   wx.navigateTo({
     url: '../qixingcai/qixingcai',
   })
 }
},

//机选

//随机产生一个0-n的随机数
Random: function (n) {
  return Math.floor(Math.random() * n);
},

//随机产生n注号码
randomNumber: function (e) {
  var n = e.currentTarget.dataset.data;
  console.log("触发事件的id",n);
  var num;
  var temp = [];
  //外循环控制产生几注机选号码，内循环产生一组随机号码
  for (var j = 0; j < n; j++) {
    if(this.data.lotteryType=="shuangseqiu"){
      var redball = [];
      var blueball = [];
      //初始化布尔数组
      for (var i = 0; i < 33; i++) {
        temp[i] = false;
      }
      //随机产生6个不相同红色球
      for (var i = 0; i < 6; i++) {
        num = this.Random(33);
        if (temp[num] == false) {

          redball.push(this.data.arrayRed[num].text);
          temp[num] = true;
        } else {
          do {
            num = this.Random(33);
          } while (temp[num] == true)
          redball.push(this.data.arrayRed[num].text);
          temp[num] = true;
        }
      }
      //随机产生一个蓝色球
      num = this.Random(16);
      blueball.push(this.data.arrayBlue[num].text);
      app.globalData.ballsList.unshift({ "redballs": redball, "blueballs": blueball, "totalZhushu": 1, "totalMoney": 2 });
      this.setData({
        ballsList: app.globalData.ballsList,
      })
    }else if(this.data.lotteryType=="daletou"){
      var redball = [];
      var blueball = [];
      //初始化布尔数组
      for (var i = 0; i < 35; i++) {
        temp[i] = false;
      }
      //随机产生5个不相同红色球
      for (var i = 0; i < 5; i++) {
        num = this.Random(35);
        if (temp[num] == false) {
          redball.push(this.data.arrayRed[num].text);
          temp[num] = true;
        } else {
          do {
            num = this.Random(35);
          } while (temp[num] == true)
          redball.push(this.data.arrayRed[num].text);
          temp[num] = true;
        }
      }
      for (var i = 0; i < 12; i++) {
        temp[i] = false;
      }
      //随机产生2个蓝色球
      for (var i = 0; i < 2; i++) {
        num = this.Random(12);
        if (temp[num] == false) {
          blueball.push(this.data.arrayBlue[num].text);
          temp[num] = true;
        } else {
          do {
            num = this.Random(12);
          } while (temp[num] == true)
          blueball.push(this.data.arrayBlue[num].text);
          temp[num] = true;
        }
      }
      app.globalData.daletouBallsList.unshift({ "redballs": redball, "blueballs": blueball, "totalZhushu": 1, "totalMoney": 2 });
    }else if(this.data.lotteryType=="qixingcai"){
      var select=[[],[],[],[],[],[],[]];
    //随机生成n注七星彩号码
    for(var i=0;i<7;i++){
     select[i].push(this.Random(9));
    }
    app.globalData.qixingcaiBallsList.unshift({ "balls":select, "totalZhushu":1, "totalMoney":2});
    }
  }
  //计算总金额和总注数
  this.show();
  //计算保底金额
  this.baodiMoney();
},
changeMethod:function(){ 
  if(this.data.shopMethod==true){
    this.setData({
      shopMethod:false,
      methodText:"取消合买",
    })
  }else{
    this.setData({
      shopMethod:true,
      methodText:"发起合买",
    })
  }

  },
//将保存选球的数组转换成字符串
arrayTostring: function (event) {
  var temp=this.data.ballsList;
  var ballNumber = "";
  if(this.data.lotteryType!="qixingcai"){
    for (var i = 0; i < temp.length; i++) {
      //保存红球的字符串
      var redstring = temp[i].redballs[0];
      //保存蓝球的字符串
      var bluestring = temp[i].blueballs[0];
      for (var j = 1; j < temp[i].redballs.length; j++) {
        redstring += "," + temp[i].redballs[j];
      }
      for (var j = 1; j < temp[i].blueballs.length; j++) {
        bluestring += "," + temp[i].blueballs[j];
      }
      //每一串的金额
      var totalmoney = temp[i].totalMoney * this.data.multiple;
      //每一串的红球和蓝球用"-分割",金额用#分割
      var betnumber = redstring + "-" + bluestring + "#" + totalmoney;
      //全部号码拼接
      if (ballNumber == "") {
        ballNumber = betnumber;
      } else {
        ballNumber += "|" + betnumber;
      }
    }
  }else{
   for(var i=0;i<temp.length;i++){
     var ballsString = "";
     var balls=temp[i].balls;
     var totalMoney=temp[i].totalMoney*this.data.multiple;
     for(var j=0;j<balls.length;j++){
       for(var k=0;k<balls[j].length;k++){
         ballsString+=balls[j][k];
       }
       if(j!=balls.length){
         ballsString += ",";
       }
     }
     var betnumber=ballsString+"#"+totalMoney;
    //全部号码拼接
    if (ballNumber == "") {
      ballNumber = betnumber;
    } else {
      ballNumber += "|" + betnumber;
    }
   }
  }
  return ballNumber;
},
// 发起购买
cat: function (e) {
  var event = e.currentTarget.dataset.data;
  this.setData({
    event:event,
  })
  var that=this;
  if (this.data.shopValue =="选择投注站出票"){
    //用户不选择投注站出票，则默认投注站为安易彩票店
    this.setData({
      shopValue:"幸福彩票店",
    })
  }
  // 发起合买
  if(event=="hemai"){
  if(this.data.baodiCopies<1){
    this.data.toastText =" 最少保底份数为1份",
    this.setData({
      toastText: this.data.toastText,
    })
    setTimeout(function(){
      this.data.toastText="";
      this.setData({
        toastText: this.data.toastText,
      })
    }.bind(this),1500);
    return;
  }
  //发起合买者保底金额不能少于1元
  if (this.data.baodiMoney<1){
    this.data.toastText="保底金额最少为1元";
    this.setData({
      toastText: this.data.toastText,
    })
    setTimeout(function () {
      this.data.toastText = "";
      this.setData({
        toastText: this.data.toastText,
      })
    }.bind(this), 1500);
    return;
  }
  }
  if(event=="orderBy"){
    if (this.data.totalMoney<2){
      this.data.toastText = "请购买再下单",
        this.setData({
          toastText: this.data.toastText,
        })
      setTimeout(function () {
        this.data.toastText = "";
        this.setData({
          toastText: this.data.toastText,
        })
      }.bind(this), 1500);
      return;
    }
  }
   //发起购买
  //判断用户之前是否登录，如果之前登录过或现在已经登录，则不再登录，否则，调用登录方法
 var value=wx.getStorageSync("login");
 if(value){
   //登录过的话，将用户的唯一标志和付款金额发送到服务器端，看是否能够购买
   that.setData({
     session:value,
   })
   that.shop();
 }else{
   wx.showToast({
     title: '未登录',
     icon: 'loading',
     duration: 700
   })
 }
},
//购买
shop: function () {
  var that = this;
  var event=this.data.event;
  var dangQi="";
  //发起购买的类型
  if(event=="orderBy"){
    var money=this.data.totalMoney;
  }else if(event=="hemai"){
    var money=this.data.baodiMoney;
  }
  //将保存选球的数组转换成字符串
  var ballNumber = that.arrayTostring(event);
  this.setData({
    IDCardStatus: false,
    ballNumber:ballNumber
  });
  //购买彩票的类型
  if(this.data.lotteryType=="shuangseqiu"){
    var lotteryType="双色球";
    //获取双色球最新期期号
    wx.request({
      url: "https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou",
      success: function (res) {
        //将最新期的期号保存在全局变量中
        var Information = res.data.shuangseqiu;
        var dangQi = parseInt(Information.tr2.qihao) + 1;
        app.globalData.dangQi = dangQi;
      }
    });
  }else if(this.data.lotteryType=="daletou"){
    var lotteryType="大乐透";
    //获取大乐透最新期的期号
    wx.request({
      url:"https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou",
      success: function (res) {
        var daletouInformation = res.data.daletou;
        var dangQi = parseInt(daletouInformation.tr2.qihao)+1;
        app.globalData.dangQi = dangQi;
      }
    });
  }else if(this.data.lotteryType=="qixingcai"){
    var lotteryType="七星彩";
    //获取七星彩最新期的期号
    wx.request({
      url:"https://nh20i6qu.qcloud.la/weapp/kaijiang/daletou",
      success: function (res) {
        var qixingcaiInformation = res.data.qixingcai;
        var dangQi= parseInt(qixingcaiInformation.tr2.qihao)+1;
        app.globalData.dangQi=dangQi;
      }
    });
  }
  // 将购买信息以json对象的形式发送到支付界面
  var shopInformation = { ballNumber:that.data.ballNumber, username: that.data.userInfo.nickName, multiple: that.data.multiple, copies: that.data.copyNumber, dianpu: that.data.shopValue, openid: that.data.session, lotteryType: lotteryType, baodiCopies: that.data.baodiCopies, issue:app.globalData.dangQi, zhuijia: that.data.zhuijia };
  app.globalData.shopInformation=shopInformation;
 // 跳转到支付方式选择界面
  wx.navigateTo({
    url: '../chongzhi/chongzhi?dangqi='+app.globalData.dangQi+"&event="+event+"&money="+money
  })
},
//完善个人信息
information:function(){
  this.setData({
    IDCardStatus:false,
  })
//跳转到完善个人信息的页面
//资料完善后在本地缓存中保存information值用户用户有注册信息后是否完善了个人资料的判断 
wx.navigateTo({
  url: '../information/information',
})
}

})
