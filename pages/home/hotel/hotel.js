let app = getApp();
let pageNum = 10;
Page({
  data: {
    imgUrls: [
      'https://api.dysceapp.com/znyx/Public/Uploads/hotelImg/jd1.jpg',
      'https://api.dysceapp.com/znyx/Public/Uploads/hotelImg/jd2.jpg',
      'https://api.dysceapp.com/znyx/Public/Uploads/restImg/ms1.jpg',
      'https://api.dysceapp.com/znyx/Public/Uploads/restImg/ms2.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    hotelStatus: true,
    hotelPage: 1,
    foodPage: 1
  },
  onLoad: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
    this.getHotel();
    this.getFood();
  },
  changeTrue: function () {
    this.setData({ hotelStatus: true })
  },
  changeFalse: function () {
    this.setData({ hotelStatus: false })
  },
  getHotel: function () {
    let that = this;
    let hotelPage = that.data.hotelPage;
    let data = {
      page: hotelPage,
      pageNum: pageNum,
    };
    app.getRequest('/ad/hotel/hotelSelect', data, function (res) {
      wx.hideToast();
      let status = res.data.status;
      if (status == 1) {
        console.log("=============第" + hotelPage + "页的内容=============");
        console.log(res.data.data);
        // 获得当前页面的内容
        let mes = res.data.data;
        for (let i = 0; i < mes.length; i++) {
          mes[i].hotelimg = mes[i].hotelimg.split(",")[0];
        }
        // 当前页面不是第一页,需要将前面的内容和现在的内容连接在一起
        if (hotelPage != 1) {
          var oldMes = that.data.hotel;
          var newMes = oldMes.concat(mes)
        } else {
          var newMes = mes;
        }
        // 获得总页数
        let count = res.data.count;
        if (count == 0) {
          that.setData({
            message: [],
            noMessage: true,
            downStatus: false,
            loadStatus: false,
            loadAllStatus: false,
          })
        } else {
          let allPage = Math.ceil(count / pageNum);
          // 下一页的页码
          let nextPage = hotelPage + 1;
          // 下一页的页码大于总页数，不继续加页码了
          if (nextPage > allPage) {
            var newPage = page;
            // 是否显示下拉加载
            var loadAllStatus = true;
            var downStatus = false;
          }
          else {
            var newPage = nextPage;
            var downStatus = true;
            var loadAllStatus = false;
          }
          that.setData({
            hotel: newMes,
            hotelPage: newPage,
            downStatus: downStatus,
            loadAllStatus: loadAllStatus,
            loadStatus: false,
            noMessage: false,
          })
        }

      } else {
        console.log("=============没有查询到数据==============");
        that.setData({
          downStatus: false,
          loadStatus: false,
          loadAllStatus: false,
          noMessage: true,
          message: []
        })
      }
    })
  },
  getFood: function () {
    let that = this;
    let foodPage = that.data.foodPage;
    let data = {
      page: foodPage,
      pageNum: pageNum,
    };
    app.getRequest('/ad/restaurant/restSelect', data, function (res) {
      wx.hideToast();
      let status = res.data.status;
      if (status == 1) {
        console.log("=============第" + foodPage + "页的内容=============");
        console.log(res.data.data);
        // 获得当前页面的内容
        let mes = res.data.data;
        for (let i = 0; i < mes.length; i++) {
          mes[i].restimg = mes[i].restimg.split(",")[0];
        }
        // 当前页面不是第一页,需要将前面的内容和现在的内容连接在一起
        if (foodPage != 1) {
          var oldMes = that.data.hotel;
          var newMes = oldMes.concat(mes)
        } else {
          var newMes = mes;
        }
        // 获得总页数
        let count = res.data.count;
        if (count == 0) {
          that.setData({
            message: [],
            noMessage: true,
            downStatus: false,
            loadStatus: false,
            loadAllStatus: false,
          })
        } else {
          let allPage = Math.ceil(count / pageNum);
          // 下一页的页码
          let nextPage = foodPage + 1;
          // 下一页的页码大于总页数，不继续加页码了
          if (nextPage > allPage) {
            var newPage = page;
            // 是否显示下拉加载
            var loadAllStatus = true;
            var downStatus = false;
          }
          else {
            var newPage = nextPage;
            var downStatus = true;
            var loadAllStatus = false;
          }
          that.setData({
            food: newMes,
            foodPage: newPage,
            downStatus: downStatus,
            loadAllStatus: loadAllStatus,
            loadStatus: false,
            noMessage: false,
          })
        }

      } else {
        console.log("=============没有查询到数据==============");
        that.setData({
          downStatus: false,
          loadStatus: false,
          loadAllStatus: false,
          noMessage: true,
          message: []
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let hotelStatus = res.data.hotelStatus;
    hotelStatus ? this.getHotel() : this.getFood()
  },
  turn : function(e){
    let id = e.currentTarget.dataset.id;
    let status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: 'hotelMessage?id='+id+"&status="+status,
    })
  }
})