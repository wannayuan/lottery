// shuangseqiu
var app=getApp();
var  arrayRed = [];
var arrayBlue = [];
for (var i = 1; i <= 33; i++) {
  var text;
  if (i< 10) {
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

  /**
   * 页面的初始数据
   */
  data: {
      warning:false,
      warningText:"",
      totalZhushu:0,
      totalMoney:0,
      jixuan:false,//机选的二级按钮
      arrayRed:arrayRed,
      arrayBlue:arrayBlue,
      selectRed:[],
      selectBlue: [],
  },
 
 onLoad:function(options){
   var newarray1 =[];
   var newarray2 = [];
   var changeballs=JSON.parse(options.changeballs);
   var selectRed=changeballs.redballs;
   var selectBlue=changeballs.blueballs;
   for(var i=0;i<this.data.arrayRed.length;i++){
     var text = this.data.arrayRed[i].text;
     for (var j = 0; j < selectRed.length;j++){
       if (selectRed[j]==text){
         newarray1[i] = { id: this.data.arrayRed[i].id, changeColor: false, text: this.data.arrayRed[i].text };  
         break;
       }else{
         newarray1[i] = { id: this.data.arrayRed[i].id, changeColor: true, text: this.data.arrayRed[i].text };
       }
     }
   }
   for (var i = 0; i < this.data.arrayBlue.length; i++) {
     var text = this.data.arrayBlue[i].text;
     for (var j = 0; j < selectBlue.length; j++) {
       if (selectBlue[j] == text) {
         newarray2[i] = { id: this.data.arrayBlue[i].id, changeColor: false, text: this.data.arrayBlue[i].text };
         break;
        } else {
         newarray2[i] = { id: this.data.arrayBlue[i].id, changeColor: true, text: this.data.arrayBlue[i].text };
       }
     }
   }
   this.setData({
     arrayRed:newarray1,
     arrayBlue:newarray2,
     selectRed:selectRed,
     selectBlue:selectBlue,

   })
},
  // 改变红球颜色
 changecolorR:function(e){
   var newarray=[];
   for(var i=0;i<this.data.arrayRed.length;i++){
     if(e.currentTarget.dataset.id==this.data.arrayRed[i].text){
      // 该数字被选中，颜色改变，并且将选中数字添加到selectRed
       if (this.data.arrayRed[i].changeColor==true)
      { 
        newarray[i] = {changeColor:false,text:this.data.arrayRed[i].text};
        this.data.selectRed.push(this.data.arrayRed[i].text);
      }
      else
       { 
         newarray[i] = { changeColor: true, text: this.data.arrayRed[i].text };
         this.data.selectRed.pop(this.data.arrayRed[i].text);
       }
       //如果红球个数不小于6并且蓝球个数不小于1(可以购买至少一注)
       if(this.data.selectRed.length>=6&&this.data.selectBlue.length>=1){
         var redLength=this.data.selectRed.length;
         var blueLength=this.data.selectBlue.length;
         this.data.totalZhushu = this.jiecheng(redLength) / (this.jiecheng(6)*this.jiecheng(redLength-6)) * blueLength;
         this.data.totalMoney = this.data.totalZhushu * 2;
         if(this.data.warning==true){
           this.data.warning=false;
           this.data.warningText="";
         }
      }else{
         this.data.totalZhushu="";
         this.data.totalMoney="";
       }
     }else{
       newarray[i] = {changeColor: this.data.arrayRed[i].changeColor , text: this.data.arrayRed[i].text };
     }
   }
   this.setData({
     arrayRed:newarray,
     selectRed:this.data.selectRed,
     totalZhushu:this.data.totalZhushu,
     totalMoney:this.data.totalMoney,
     warning:this.data.warning,
     warningText:this.data.warningText,
   })
 },
 //改变蓝球颜色
  changecolorB: function (e) {
   var newarray = [];
   for (var i = 0; i < this.data.arrayBlue.length; i++) {
     if (e.currentTarget.dataset.id == this.data.arrayBlue[i].text) {
      //  被选中
       if (this.data.arrayBlue[i].changeColor == true)
       { 
         newarray[i] = {changeColor: false, text: this.data.arrayBlue[i].text }; 
         this.data.selectBlue.push(this.data.arrayBlue[i].text);
         }
       else
       { 
         newarray[i] = {changeColor: true, text: this.data.arrayBlue[i].text };
         this.data.selectBlue.pop(this.data.arrayBlue[i].text);
       }
       //如果红球个数不小于6并且蓝球个数不小于1(可以购买至少一注)，则显示已选择投注和金额，否则清空投注和金额
       if (this.data.selectRed.length >= 6 && this.data.selectBlue.length >= 1) {
         var redLength = this.data.selectRed.length;
         var blueLength = this.data.selectBlue.length;
         this.data.totalZhushu = this.jiecheng(redLength) / (this.jiecheng(6) * this.jiecheng(redLength - 6)) * blueLength;
         this.data.totalMoney = this.data.totalZhushu * 2;
         if (this.data.warning == true) {
           this.data.warning = false;
           this.data.warningText = "";
         }
       }else{
         this.data.totalZhushu="";
         this.data.totalMoney="";
       }

     } else {
        newarray[i] = {changeColor: this.data.arrayBlue[i].changeColor, text: this.data.arrayBlue[i].text };
     }
   }
   this.setData({
     arrayBlue: newarray,
     selectBlue:this.data.selectBlue,
     totalZhushu: this.data.totalZhushu,
     totalMoney: this.data.totalMoney,
     warning: this.data.warning,
     warningText: this.data.warningText,
   })
 },
 //发起合买
 hemai:function(){
   if(this.data.selectRed.length>=6&&this.data.selectBlue.length>=1){
     app.globalData.ballsList.unshift({ "redballs": this.data.selectRed, "blueballs": this.data.selectBlue, "totalZhushu": this.data.totalZhushu, "totalMoney": this.data.totalMoney });
     wx.redirectTo({
       url: '../touzhu/touzhu?lotteryType=shuangseqiu',
     })
   }else{
     this.setData({
       warningText:"请至少选择6个红球，一个蓝球",
       warning:true
     })
   }
 },

 //计算n的阶乘
jiecheng:function(n){
  if(n==1||n==0){
    return 1;
  }else{
    return n*this.jiecheng(n-1);
  }
},

//机选
jixuan:function(){
 if(this.data.jixuan===false){
   this.data.jixuan=true
 }else{
   this.data.jixuan=false
 }
 this.setData({
   jixuan:this.data.jixuan
 })
},

//随机产生一个0-n的随机数
Random:function(n){
  return Math.floor(Math.random()*n);
},

//随机产生n注号码
randomNumber:function(e){
  var n=e.currentTarget.dataset.data;
  var num;
  var temp=[];
  var ballsList=[];
  //外循环控制产生几注机选号码，内循环产生一组随机号码
for(var j=0;j<n;j++){
   var redball = [];
   var blueball = [];
  //初始化布尔数组
  for(var i=0;i<33;i++){
    temp[i]=false;
  }
  //随机产生6个不相同红色球
  for(var i=0;i<6;i++){
    num=this.Random(33);
    if(temp[num]==false){
      redball.push(this.data.arrayRed[num].text);
      temp[num] = true;
    }else{
      do{
        num=this.Random(33);
      }while(temp[num]==true)
      redball.push(this.data.arrayRed[num].text);
      temp[num] = true;
    }
  }
  //随机产生一个蓝色球
  num=this.Random(16);
  blueball.push(this.data.arrayBlue[num].text);
   app.globalData.ballsList.unshift({"redballs":redball,"blueballs":blueball,"totalZhushu":1,"totalMoney":2});
  }
  wx.navigateTo({
    url: '../touzhu/touzhu?lotteryType=shuangseqiu'
  })
}
})
