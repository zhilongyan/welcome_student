Page({
  data: {
    allStatus: false,
    campusStatus: false,
    comprehensiveStatus: false,
    libraryStatus: false,
    restaurantStatus: false,
    bathStatus: false,
    waterStatus: false,
    expressStatus : false,
    campusImage : [
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/bhxq1.jpg",
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/bhxq2.jpg",
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/bhxq3.jpg",
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/bhxq4.jpg",
    ],
    libraryImage : [
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/library1.jpg",
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/library2.jpg",
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/library3.jpg",
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/library4.jpg",
    ],
    comprehensiveImage : [
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/zhl.jpg",
    ],
    allImage: [
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/bb1.jpg",
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/bb2.jpg",
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/bb3.jpg",
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/bb4.jpg",
    ],
    restaurantImage: [
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/ct1.jpg",
      "https://www.codemobile.cn/znyx/Public/Uploads/schoolInfo/ct2.jpg",
    ],
  },
  onLoad: function (options) {

  },
  // 校园概况
  allChange: function (e) {

    this.setData({
      campusStatus: false,
      comprehensiveStatus: false,
      libraryStatus: false,
      restaurantStatus: false,
      bathStatus: false,
      expressStatus: false,
      waterStatus: false
    });
    let that = this;

    setTimeout(function () {
      that.setData({ allStatus: !that.data.allStatus })
    }, 100)
  },
  // 渤海校区
  campusChange: function (e) {
    this.setData({
      allStatus: false,
      comprehensiveStatus: false,
      libraryStatus: false,
      restaurantStatus: false,
      bathStatus: false,
      expressStatus: false,
      waterStatus: false
    });
    let that = this;
    setTimeout(function () {
      that.setData({ campusStatus: !that.data.campusStatus })
    }, 100)
  },
  // 综合楼
  comprehensiveChange: function (e) {
    this.setData({
      allStatus: false,
      campusStatus: false,
      libraryStatus: false,
      restaurantStatus: false,
      bathStatus: false,
      expressStatus: false,
      waterStatus: false
    });
    let that = this;
    setTimeout(function () {
      that.setData({ comprehensiveStatus: !that.data.comprehensiveStatus })
    }, 100)
  },
  // 图书馆
  libraryChange: function (e) {
    this.setData({
      allStatus: false,
      campusStatus: false,
      comprehensiveStatus: false,
      restaurantStatus: false,
      bathStatus: false,
      expressStatus: false,
      waterStatus: false
    });
    let that = this;
    setTimeout(function () {
      that.setData({ libraryStatus: !that.data.libraryStatus })
    }, 100)
  },
  // 餐厅
  restaurantChange: function (e) {
    this.setData({
      allStatus: false,
      campusStatus: false,
      comprehensiveStatus: false,
      libraryStatus: false,
      bathStatus: false,
      expressStatus: false,
      waterStatus: false
    });
    let that = this;
    setTimeout(function () {
      that.setData({ restaurantStatus: !that.data.restaurantStatus })
    }, 100)
  },
  // 浴室
  bathChange: function (e) {
    this.setData({
      allStatus: false,
      campusStatus: false,
      comprehensiveStatus: false,
      libraryStatus: false,
      restaurantStatus: false,
      expressStatus: false,
      waterStatus: false
    });
    let that = this;
    setTimeout(function () {
      that.setData({ bathStatus: !that.data.bathStatus })
    }, 100)
  },
// 饮水处
  waterChange: function (e) {
    this.setData({
      allStatus: false,
      campusStatus: false,
      comprehensiveStatus: false,
      libraryStatus: false,
      restaurantStatus: false,
      expressStatus: false,
      bathStatus: false,
    });
    let that = this;
    setTimeout(function () {
      that.setData({ waterStatus: !that.data.waterStatus })
    }, 100)
  },
  // 快递信息
  expressChange : function(e){
    this.setData({
      allStatus: false,
      campusStatus: false,
      comprehensiveStatus: false,
      libraryStatus: false,
      restaurantStatus: false,
      bathStatus: false,
    });
    let that = this;
    setTimeout(function () {
      that.setData({ expressStatus: !that.data.expressStatus })
    }, 100)
  }

})