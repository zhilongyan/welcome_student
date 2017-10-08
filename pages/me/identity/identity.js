let app = getApp();
let _server = app._server;
Page({
  data: {
  },
  onLoad: function (options) {
    this.judgeSfz()
  },
  // 判断用户身份认证状态
  judgeSfz: function () {
    let that = this;
    let  studentNum = app.studentNum;
    app.getStudentMes(studentNum,function(res){
      let sfzstatus = res.sfzstatus;
      let img = res.sfzimg;
      let sfzinfo = res.sfzinfo;
      console.log("==========图片地址=============");
      console.log(img);
      that.setData({ sfzstatus: sfzstatus, img: img,sfzinfo:sfzinfo });
    })

  },
  // 选择图片
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
  // 确认提交按钮
  sure: function () {
    let img = this.data.img;
    if (img == undefined) {
      app.showErrorModal("请拍照!")
      return;
    }
    wx.showModal({
      content: '请确定好您的照片是清晰可见的',
      success: function (res) {
        if (res.confirm) {
          console.log("上传")
          let student = wx.getStorageSync("student_Info")
          let session_id = wx.getStorageSync("session_id");
          // 上传照片
          wx.uploadFile({
            url: _server + '/student/sfzImg',
            filePath: img,
            name: student.studentnum,
            formData: {
              "Content-Type": "application/x-www-form-urlencoded",
              name: student.studentnum,
              session_id: session_id,
              sclass: student.class,
              smajor: student.majorname
            },
            success: function (res) {
              console.log(res);
              // 将json数据转换成对象
              let data = JSON.parse(res.data);
              let jfdata = {
                studentNum: student.studentnum,
                sfzstatus: 2,
                sfzimg: data.data,
              }
              console.log("=========上传成功返回的图片地址===========");
              console.log(data.data);
              if (data.status == 1) {
                // 更新学生信息,主要更新sfzstatus，图片地址没有变化
                app.putRequest('/student/stuUpdate', jfdata, function (res) {
                  wx.hideToast();
                  let status = res.data.status;
                  if (status == 1) {
                    wx.showToast({
                      title: '上传成功',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 1000)
                  } else {
                    let msg = res.data.msg;
                    app.showErrorModal(msg)
                  }
                })
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


        } else if (res.cancel) {
          return
        }
      }
    })

  },
  // 修改
  modify : function(){
    this.setData({ sfzstatus : 0})
  },
  // 查看实例
  example : function(){
    wx.navigateTo({
      url: '../sfzsexample/sfzsexample',
    })
  }
})