// pages/home/route/route.js
let app = getApp();
let _server = app._server;
// 用来防止点赞过快的
let likeStatus = false;
Page({
  data: {
    endArr: ["渤海校区","保定校区", "秦皇岛校区"],
    endIndex: 0,
  },
  onLoad: function (options) {
    let student = wx.getStorageSync('student_Info');
    let start = app.regularAddress(student.address,1);
    let end = student.university;
    this.setData({start:start,end:end});
    this.query()
  },
  // 起点输入框
  start: function (e) {
    let value = e.detail.value;
    this.setData({ start: value });
  },
  // 查询按钮
  query: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    let that = this;
    let start = that.data.start;
    let index = that.data.endIndex/1
    let end = that.data.endArr[index];
    if (end == undefined || start == undefined || start == "") {
      wx.hideToast();
      return
    }
    let data = {
      start: start,
      end: end
    };
    app.getRequest('/way/waySelect', data, function (res) {
      wx.hideToast();
      let status = res.data.status;
      if (status == 1) {
        let message = res.data.data;
        if (message.length == 0) {
          app.showErrorModal("此出发点还没有最优路线")
        }
        for (let i = 0; i < message.length; i++) {
          message[i].click = false;
        }
        that.setData({ message: message })
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  },
  top: function (e) {
    if (likeStatus) return;
    likeStatus = true;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let message = this.data.message;
    if (message[index].click) {
      var click = 0;
      message[index].top--;
    } else {
      var click = 1;
      message[index].top++;
    }
    let that = this;
    let data = {
      id: id,
      click: click
    };
    app.putRequest('/way/wayUpdate', data, function (res) {
      let status = res.data.status;
      likeStatus = false
      if (status == 1) {
        message[index].click = !message[index].click;
        that.setData({ message: message });
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }

    })
  },
  // 选择终点
  end: function (e) {
    console.log(e)
    let end = e.detail.value;
    this.setData({ end: end })
  }
})