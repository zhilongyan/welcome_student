// pages/station/confirmArrival/confirmArrival.js
let app = getApp();
let _server = app._server;
let studentNum
Page({
  data: {},
  onLoad: function (options) {
    studentNum = app.studentNum;
    let position = options.position;
    this.setData({ position: position })
  },
  // 确认到站
  sure: function () {
    let data = {
      pstudentnum: studentNum,
      pstatus: 1
    };
    app.showLoadToast();
    app.postRequest('/position/poAdd', data, function (res) {
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        console.log("================确认到站=============");
        console.log(res.data);
        app.usecar = 3;
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index'
          })
        }, 1000)
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  },
  // 取消到站
  cancel: function () {
    let data = {
      pstudentnum: studentNum
    };
    app.showLoadToast();
    app.postRequest('/position/poDel', data, function (res) {
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        app.usecar = 1;
        console.log("================取消到站状态=============");
        console.log(res.data);
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index'
          })
        }, 1000)
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  }
})