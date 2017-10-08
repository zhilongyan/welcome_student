var app = getApp();
//每页默认个数
let pageNum = 10;
Page({
  data: {
    iconArray: [],
    downStatus: true,
    loadStatus: false,
    loadAllStatus: false,
    page: 1,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    app.showLoadToast();
    this.getMes();
  },
  getMes: function () {
    app.showLoadToast();
    let that = this;
    let page = that.data.page;
    let student = wx.getStorageSync('student_Info')
    let address = this.regularAddress(student.address);
    let data = {
      page: page,
      pageNum: pageNum,
      address: address,
      stype: 2,
      infopub: 1
    };
    app.getRequest('/student/stuSelect', data, function (res) {
      wx.stopPullDownRefresh();
      wx.hideToast();
      let status = res.data.status;
      if (status == 1) {
        console.log("=============第" + page + "页的内容=============");
        console.log(res.data.data);
        // 获得当前页面的内容
        let mes = res.data.data;
        for (var i = 0; i < mes.length; i++) {
          var str = mes[i].address
          mes[i].address = app.regularAddress(str);
        }
        // 当前页面不是第一页,需要将前面的内容和现在的内容连接在一起
        if (page != 1) {
          var oldMes = that.data.iconArray;
          var newMes = oldMes.concat(mes)
        } else {
          var newMes = mes;
        }
        // 获得总页数
        let count = res.data.count;
        if (count == 0) {
          that.setData({
            iconArray: [],
            noiconArray: true,
            downStatus: false,
            loadStatus: false,
            loadAllStatus: false,
            noMessage: "用户信息选择隐藏，暂时没有可查看的用户"
          })
        } else {
          let allPage = Math.ceil(count / pageNum);
          // 下一页的页码
          let nextPage = page + 1;
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
            iconArray: newMes,
            page: newPage,
            downStatus: downStatus,
            loadAllStatus: loadAllStatus,
            loadStatus: false,
            noiconArray: false,
          })
        }

      } else {
        console.log("=============没有查询到数据==============");
        that.setData({
          downStatus: false,
          loadStatus: false,
          loadAllStatus: false,
          noiconArray: true,
          iconArray: []
        })
      }
    })
  },
  // 正则截取地址
  regularAddress: function (address) {
    // let substr = address.match(/(\S*)(?=省)/);
    let substr1 = address.match(/省(\S*)市/);
    // let substr2 = address.match(/(\S*)(?=市)/);
    // let substr3 = address.match(/(\S*)(?=县)/);
    let substr4 = address.match(/市(\S*)县/);
    let substr5 = address.match(/市(\S*)区/);
    // 这个用来处理省完了直接是县的，中间没有写市
    if (substr4 == null && substr5 == null) {
      // substr = null;
      substr4 = address.match(/省(\S*)县/);
      substr5 = address.match(/省(\S*)区/);
    }
    // let provice = substr ? substr[1] + "省" : address;
    let city = substr1 ? substr1[1] + "市" : "";
    let county = substr4 ? substr4[1] + "县" : '';
    let area = substr5 ? substr5[1] + "区" : '';
    // 这个是加了**省，下面那个没加
    // var newAddress = provice + city + area + county;
    var newAddress = city + area + county;
    return newAddress;
  },
  // 监听用户下拉动作
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    this.setData({ page: 1 });
    this.getMes();
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    //获取现在是否已全部加载完毕
    let loadAllStatus = this.data.loadAllStatus;
    //如果全部加载完毕，则不执行下拉加载
    if (loadAllStatus == true) return;
    //显示加载中
    this.setData({ loadStatus: true, downStatus: false });
    this.getMes();
    console.log("上拉加载")
  }
})
