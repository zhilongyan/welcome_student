// pages/me/changImg/changImg.js
let app = getApp();
let _server = app._server;
Page({
  data: {
    face: '',
    studentNum: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    let face = options.face;
    let studentNum = options.id;
    this.setData({ face: face, studentNum: studentNum })
  },
  changeImg: function () {
    console.log("===============上传头像按钮==================")
    let studentNum = this.data.studentNum;
    let that = this;
    let session_id = wx.getStorageSync('session_id');
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showToast({
          title: "上传中",
          icon: "loading",
          duration: 60000,
        })
        wx.uploadFile({
          url: _server +  '/student/face',
          filePath: tempFilePaths[0],
          name: studentNum,
          formData: {
            "Content-Type": "application/x-www-form-urlencoded",
            name: studentNum,
            session_id : session_id 
          },
          success: function (res) {
            console.log(res);
            // 将json数据转换成对象
            let data = JSON.parse(res.data);

            wx.hideToast();
            if (data.status == 1) {
              let face = data.data;
              let student = wx.getStorageSync('student_Info');
              student.face = face;
              wx.setStorageSync('student_Info', student)
              wx.navigateBack({
                delta: 1
              })
            }
            else {
              let msg = data.msg;
              app.showErrorModal(msg)
            }
          },
          fail: function (res) {
            wx.hideToast();
            let msg = res.errMsg;
            app.showErrorModal(msg)
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})