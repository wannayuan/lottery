Page({
  data:{
    useMoney:0, //可用余额
    tixianMoney:"0", //提现金额
    toastText: "", //提现警告    
  },
onLoad:function(options){
  var useMoney=options.usemoney;
  this.setData({
    useMoney:useMoney
  })
},
//输入提现金额
inputMoney:function(e){
 var money=e.detail.value;
 this.setData({
   tixianMoney:money
 })
},
//提现
tixian:function(){
  var money=this.data.tixianMoney;
  if(parseFloat(money)<=0||parseFloat(money)>parseFloat(this.data.useMoney)||parseFloat(money)==""){
    this.setData({
      toastText:"请输入正确的提现金额"
    })
  }else{
    //发起提现
    this.setData({
      toastText: ""
    });
    //调用提现接口
    this.random();
  }
},
//生成不超过32位的随机字符串
random:function(){
 var login=wx.getStorageSync("login");
 var str="";
 for(var i=0;i<10;i++){
   str+=parseInt(Math.random()*5);
 }
 console.log("随机字符串"+str);
// this.gettixian(str);
 this.qiyepay(str,login);
},
gettixian:function(){
 wx.request({
   url:"https://www.delewu.com/ceshi/gettixian",
   data:{
     appid:"wxb8f80e37e499bb73",
     mch_id:"1339641801",
     device_info:"1000", 
     body:"test",
     nonce_str:str,
   },
   success:function(res){
     console.log(res.data);
   }
 })
},
//企业付款
qiyepay:function(str,login){
 wx.request({
   url:"http://www.pkpao.cn/curl/qiyepay.php",
   data:{
    nonce_str:str,
    partner_trade_no:"100000982014120919616",
    openid:login,
    check_name:"FORCE_CHECK",
    re_user_name:"袁敏",
    amount:1,
    sign:"C97BDBACF37622775366F38B629F45E3",
   },
   success:function(res){
     console.log("返回状态码"+res.data);
   }
 })
},
sure:function(){
  this.setData({
    toastText:""
  })
}
})