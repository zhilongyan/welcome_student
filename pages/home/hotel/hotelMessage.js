// pages/home/hotel/hotelMessage.js
let app = getApp();
Page({

  data: {
    role :0
  },
  onLoad: function (options) {
    let id = options.id;
    let role = options.status;
    let data = {
      id: id
    }
    wx.showLoading({
      title: '加载中',
    })
    if (role == 1) {
      this.getHotel(data);
    }
    if (role == 2) {
      this.getFood(data);
    }
    this.setData({role:role})
  },
  getHotel: function (data) {
    let that = this;
    app.getRequest("/ad/hotel/hotelSelect", data, function (res) {
      wx.hideLoading()
      let status = res.data.status;
      if (status == 1) {
        let mes = res.data.data;
        let img = mes[0].hotelimg;
        let mesImg = mes[0].hotelimg.split(",");
        let num = mesImg.length;
        mes[0].hotelimg = mesImg[0];

        that.setData({ hotel: mes[0], num: num, img: img })
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  },
  getFood: function (data) {
    let that = this;
    app.getRequest("/ad/restaurant/restSelect", data, function (res) {
      wx.hideLoading()
      let status = res.data.status;
      if (status == 1) {
        let mes = res.data.data;
        let img = mes[0].restimg;
        let mesImg = mes[0].restimg.split(",");
        let num = mesImg.length;
        mes[0].restimg = mesImg[0];
        that.setData({ food: mes[0], num: num, img: img })
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  },
  call: function (e) {
    let num = e.target.dataset.num;
    wx.makePhoneCall({
      phoneNumber: num,
    })
  },
  more: function () {
    let img = this.data.img;
    wx.navigateTo({
      url: 'hotelImg?img=' + img,
    })
  }
})