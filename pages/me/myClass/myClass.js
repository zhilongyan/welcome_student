// pages/myClass/myClass.js
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
    // app.getRequest('/student/stuSelect', data, function (res) {
    //   wx.hideToast()
    //   let status = res.data.status;
    //   if (status == 1) {
    //     console.log(res.data.data)
    //     var value = res.data.data
    //     for (var i = 0; i < value.length; i++) {
    //       value[i].tag = app.changeCharacter(value[i].tag);
    //       var str = value[i].address
    //       value[i].address = app.regularAddress(str);
    //       value[i].showStatus = false;
    //     }

    //     that.setData({
    //       iconArray: value
    //     })
    //   } else {
    //     let msg = res.data.msg;
    //     app.showErrorModal(msg)
    //   }
    // })
  },
  // 显示性格标签
  show: function (e) {
    let index = e.target.dataset.id;
    let data = this.data.iconArray;
    data[index].showStatus = true;
    this.setData({ iconArray: data });
  },
  // 隐藏性格标签
  hide: function (e) {
    let index = e.target.dataset.id;
    let data = this.data.iconArray;
    data[index].showStatus = false;
    this.setData({ iconArray: data });
  },
  getMes: function () {
    let that = this;
    let page = that.data.page;
    let student = wx.getStorageSync('student_Info')
    var class_id = student.class;
    var majorname = student.majorname;
    let data = {
      page: page,
      pageNum: pageNum,
      class: class_id,
      majorname: majorname,
      infopub:'1'
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
          mes[i].tag = app.changeCharacter(mes[i].tag);
          var str = mes[i].address
          mes[i].address = app.regularAddress(str);
          mes[i].showStatus = false;
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
  },
})