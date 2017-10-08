// pages/me/suerDorm/sureDorm.js
let app = getApp();
let student;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    student = wx.getStorageSync("student_Info");
    if (student.dormstatus / 1) {
      this.setData({ sureDorm: true })
    } else {
      this.setData({ sureDorm: false });
    }
  },
  sure: function () {
    this.setData({ status: true });
    let that = this;
    wx.showModal({
      content: '确认入住宿舍？',
      success: function (res) {
        if (res.confirm) {
          let data = {
            studentNum: app.studentNum,
            dormstatus: 1
          }
          app.putRequest("student/stuUpdate", data, function (res) {
            let status = res.data && res.data.status;
            if (status) {
              let msg = res.data.msg;
              wx.showToast({
                title: msg,
                icon: 'success',
                duration: 1000
              });
              student.dormstatus = 1;
              wx.setStorageSync('student_Info', student)
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else {
              that.setData({ status: false })
              console.log("=======更改宿舍状态出错========");
              let msg = res.data.msg;
              app.showErrorModal(msg);
            }

          })
        } else if (res.cancel) {
          that.setData({ status: false })
          console.log('用户点击取消')
        }
      }
    })

  }
})