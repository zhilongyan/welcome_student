let app = getApp();
let _server = app._server;
Page({
  data: {
  },
  onLoad: function (options) {
    let student = wx.getStorageSync("student_Info");
    let jiaofeibh = student.jiaofeibh;
    if(jiaofeibh){
      let img = _server + "/Public/Uploads/jfdImg/" + student.studentnum + ".png"
      this.setData({ sureStatus:true,list:jiaofeibh,img:img})
    }else{
      this.setData({sureStatus:false})
    }
  },
  changeImg: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({ img: tempFilePaths[0] })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  sure: function () {
    let img = this.data.img;
    let list = this.data.list;
    if (list == undefined) {
      return
    }
    if (img == undefined) {
      app.showErrorModal("请给你的收费单拍照")
      return;
    }
    wx.showModal({
      content: '请确定好您的单号，此单号只可以上传一回',
      success: function (res) {
        if (res.confirm) {
          console.log("上传")
          let student = wx.getStorageSync("student_Info")
          let session_id = wx.getStorageSync("session_id");
          let data = {
            studentNum: student.studentnum,
            jiaofeibh: list
          }
          app.putRequest('/student/stuUpdate', data, function (res) {
            let status = res.data.status;
            if (status == 1) {
              wx.uploadFile({
                url: _server + '/student/jfdImg',
                filePath: img,
                name: student.studentnum,
                formData: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  name: student.studentnum,
                  session_id: session_id 
                },
                success: function (res) {
                  console.log(res);
                  // 将json数据转换成对象
                  let data = JSON.parse(res.data);

                  wx.hideToast();
                  if (data.status == 1) {
                    student.jiaofeibh = list;
                    wx.setStorageSync("student_Info", student)
                    wx.showToast({
                      title: '成功',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 1000)
                  }
                  else {
                    let msg = data.msg;
                    app.showErrorModal(msg)
                  }
                },
                fail: function (res) {
                  let msg = res.errMsg;
                  app.showErrorModal(msg)
                }
              })
            } else {
              let msg = res.data.msg;
              app.showErrorModal(msg)
            }
          })

        } else if (res.cancel) {
          return
        }
      }
    })

  },
  list: function (e) {
    let value = e.detail.value;
    this.setData({ list: value })
  }
})