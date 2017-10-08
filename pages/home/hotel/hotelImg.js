// pages/home/hotel/hotelImg.js
Page({
  data: {
  
  },
  onLoad: function (options) {
    let img = options.img.split(",");
    this.setData({img:img})
  },
})