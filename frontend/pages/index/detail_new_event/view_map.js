//index.js
//获取应用实例
const app = getApp()

Page({
  data: {    
    latitude:0,
    longitude:0,
    markers:[]
  }, 
  onLoad: function (option) {    
    var that = this;
    that.setData({
        latitude:option.latitude,
        longitude:option.longitude
    });
    var markers = [];
    markers.push({
      iconPath: "/image/per@2x.png",
      id: 0,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      width: 30,
      height: 36      
    });   
    that.setData({
      markers:markers      
  }); 
  },  
})
