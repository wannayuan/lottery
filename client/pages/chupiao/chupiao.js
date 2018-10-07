Page({
  data:{
    id:"",   //要出票号码的id
  },
onLoad:function(options){
  var id=options.id;
  this.setData({
    id:id,
  })
},

})