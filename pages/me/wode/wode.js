var app = getApp();

Page({
  data: {
    remind: '加载中',
    userInfo: {},
    student_Info: {},
    loginStatus: false,
    message: [{
      bindtap: 'tap_Username',
      img: '/image/id.png',
      item: '个人信息'
    },
    {
      bindtap: 'tap_Leader',
      img: '/image/teacher.png',
      item: '我的辅导员'
    },
    {
      bindtap: 'tap_myClass',
      img: '/image/class.png',
      item: '我的班级'
    },
    {
      bindtap: 'fellow',
      img: '/image/fellow.png',
      item: '我的同乡'
    },
    ],
    feature: [
      {
        bindtap: 'tap_reply',
        img: '/image/request.png',
        item: '回复我的'
      }, {
        bindtap: 'tap_question',
        img: '/image/question.png',
        item: '我的提问'
      }, {
        bindtap: 'tap_map',
        img: '/image/location.png',
        item: '查看位置'
      },
      {
        bindtap: 'tap_password',
        img: '/image/psd_change.png',
        item: '修改密码'
      },
      {
        bindtap: 'payment',
        img: '/image/payment.png',
        item: '提交缴费单'
      },
      {
        bindtap: 'scan',
        img: '/image/scan.png',
        item: '扫码报道'
      },
    ],

  },
  onLoad: function () {
    // wx.showNavigationBarLoading()
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1000);


  },
  onShow: function () {
    let that = this;
    let student = wx.getStorageSync('student_Info')
    let userInfo = {
      name: student.name,
      studentnum: student.studentnum,
      face: student.face,
    }
    this.setData({
      student_Info: student,
      userInfo: userInfo,
      role: 0,


    });
  },
  // 修改个人信息
  tap_Username: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500,
      mask: true
    })
    wx.navigateTo({
      url: '../person_Info/person_Info'
    })
  },
  // 我的同班同学
  tap_myClass: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    let role = this.data.role;
    wx.navigateTo({
      url: '../myClass/myClass'
    })
  },
  // 我的宿舍
  tap_myDorm: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    wx.navigateTo({
      url: '../myClass/myDorm'
    })
  },
  // 我的导员
  tap_Leader: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    wx.navigateTo({
      url: '../myClass/myLeader'
    })
  },
  // 查看位置
  tap_map: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      },
      fail: function (res) {
        wx.navigateTo({
          url: '../../fail/fail',
        })
      }
    })
  },
  // 回复我的
  tap_reply: function () {
    let role = this.data.role;
    wx.navigateTo({
      url: '../reply/reply'
    })
  },
  // 我的提问
  tap_question: function () {
    wx.navigateTo({
      url: '../question/question'
    })
  },
  // 退出
  quit: function () {
    let that = this;
    wx.showModal({
      content: '确认退出？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync("student_Info"); var url = "/student/stuLogout";
          app.postRequest(url, {}, function (res) {
            let status = res.data.status;
            if (status == 1) {
              wx.removeStorageSync("user_Info");
              wx.removeStorageSync("session_id");
              wx.removeStorageSync("dorm");
              wx.redirectTo({
                url: '/pages/login/login',
              })
            } else {
              let msg = res.data.msg;
              app.showErrorModal(msg);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 上传头像
  changeImg: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    let studentNum = this.data.student_Info.studentnum;
    let face = this.data.student_Info.face;
    // this.setData({ "userInfo.face_photo": "/image/touxiang.jpg" })
    wx.navigateTo({
      url: '../changeImg/changeImg?id=' + studentNum + '&face=' + face,
    })
  },
  // 修改密码
  tap_password: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    wx.navigateTo({
      url: '../resetPassword/resetPassword'
    })
  },
  // 我的同乡
  fellow: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    wx.navigateTo({
      url: '../fellow/fellow'
    })
  },
  // 我的缴费单
  payment: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    wx.navigateTo({
      url: '../payment/payment'
    })
  },
  // 扫码报道
  scan: function () {
    let student = wx.getStorageSync("student_Info");
    if(student.report == 1){
      app.showErrorModal("您已经成功报到，请勿重复报到！");
      return;
    }
    console.log("dianjile")
    wx.scanCode({
      success: function (res) {
        let url = res.result;
        wx.redirectTo({
          url: url
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  code : function(){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      mask: true
    })
    wx.navigateTo({
      url: '../my_QR_code/my_QR_code'
    })
  },
  about : function(){
    wx.navigateTo({
      url: '../about/about',
    })
  },
  identity : function(){
    wx.navigateTo({
      url: '../identity/identity',
    })
  },
  // 确认入住宿舍
  sureDorm : function(){
    wx.navigateTo({
      url : "../sureDorm/sureDorm"
    })
  }
})