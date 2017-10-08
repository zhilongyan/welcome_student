// pages/station/index/index.js
let app = getApp();
let student;
let teacher;
let stu;
let QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;
Page({
  data: {
    name: '',
    address: '未选择到站位置',
    loginStatus: false,
    explainStatus: true,
    // usecar: '2',
    position: ["未到站"],
    positionIndex: 0

  },
  onLoad: function () {
    // 获取顶部图片
    // qqmapsdk = new QQMapWX({
    //   key: 'PU4BZ-AWQAO-7XZWT-SAL6P-CLEGK-PRBAZ'
    // });

    // 判断用户是否选择过到校方式
    // var explainStatus
    // if (usecar == 0) {
    //   explainStatus = false;
    // }
    // else {
    //   explainStatus = true;
    // }

  },
  onShow: function (options) {
    let usecar = app.usecar;
    this.setData({ usecar: usecar });
    let position = this.data.position;
    if (position.length <= 1) {
      this.getPosition();
    }
  },
  //确定已经到站位置
  seePosition: function (e) {
    console.log(e);
    let value = e.detail.value;
    this.setData({ positionIndex: value })
  },
  //向管理员发送到站位置
  informStation: function () {
    let usecar = this.data.usecar;
    let that = this;
    let position = that.data.position[that.data.positionIndex]
    if (position == '未到站') {
      wx.hideToast();
      wx.showModal({
        title: '提示',
        content: '请先选择到站位置',
        showCancel: false,
        confirmText: "好的",
      })
      return
    };
    let studentNum = app.studentNum;
    let data = {
      pstudentnum: studentNum,
      position: position,
    };
    app.showLoadToast();
    app.postRequest('/position/poAdd', data, function (res) {
      wx.hideToast();
      console.log(res)
      let status = res.data.status;
      if (status == 1) {
        wx.redirectTo({
          url: '../confirmArrival/confirmArrival?position=' + position,
        })
      } else {
        let msg = res.data.msg
        app.showErrorModal(msg, '有错误')
      }
    })


  },
  // 选择自驾
  selfDirve: function () {
    let that = this;
    app.showLoadToast("请稍后", 1000, function () {
      setTimeout(function () {
        app.updateUsecar(2, function () {
          that.setData({ usecar: 2 });
          app.usecar = 2;
        })
      }, 1000)
    })
  },
  // 选择乘坐公共交通方式
  publicTransport: function () {
    let that = this;
    app.showLoadToast("请稍后", 1000, function () {
      setTimeout(function () {
        app.updateUsecar(1, function () {
          that.setData({ usecar: 1 });
          app.usecar = 1;
        })

      }, 1000)
    })


  },
  // 修改乘车方式
  reviseTransport: function () {
    let that = this;
    app.showLoadToast("请稍后", 1000, function () {
      setTimeout(function () {
        that.setData({ usecar: 0 })
        // app.updateUsecar(0, function () {
        // })
      }, 1000)
    })
  },
  // 说明块中点击关闭按钮
  hideHelp: function () {
    this.setData({ explainStatus: true })
  },
  explain: function () {
    console.log("dianji")
    this.setData({ explainStatus: false })
  },
  // 使用腾讯位置服务自动获取当前位置
  getAddress: function () {
    app.showLoadToast("获取定位中，请稍后")
    let that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        let latitude = res.latitude;
        let longitude = res.longitude;
        let location = {
          latitude: latitude,
          longitude: longitude
        };
        qqmapsdk.reverseGeocoder({
          location: location,
          success: function (res) {
            wx.hideLoading()
            let address = res.result.formatted_addresses.recommend;
            that.setData({ address: address })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      },
      fail: function (res) {
        wx.hideLoading()
        console.log("=============获取定位失败===================")
        console.log(res)
        // wx.navigateTo({
        //   url: '../../fail/fail',
        // })
      },
    })
  },
  // 取消到站
  cancel: function () {
    let studentNum = app.studentNum;
    let data = {
      pstudentnum: studentNum
    };
    app.showLoadToast();
    let that = this;
    app.postRequest('/position/poDel', data, function (res) {
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        app.usecar = 1;
        console.log("================取消到站状态=============");
        console.log(res.data);
        app.usecar = 1;
        that.setData({ usecar: 1 })
        that.getAddress();
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
  },
  // 获取到站站点
  getPosition: function () {
    let that = this;
    app.getRequest("position/getPo", {}, function (res) {
      console.log("到站站点")
      let status = res.data.status;
      if (status) {
        let position = that.data.position;
        let newPosition = position.concat(res.data.data);
        that.setData({ position: newPosition })

      } else {
        console.log("======获取到站位置出现错误========")
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
})