// pages/login/login_EML.js
let app = getApp();
var md5 = require("../../../utils/md5.min.js");
Page({
  data: {

  },
  // 输入框 的设定
  oldPasswordInput: function (e) {
    this.setData({ oldPassword: e.detail.value })
  },
  newPasswordInput: function (e) {
    this.setData({
      newPassword: e.detail.value
    });
  },
  againPasswordInput: function (e) {
    this.setData({
      againPassword: e.detail.value
    });
  },
  // 聚焦样式
  oldFocus: function (e) {
    this.setData({
      oldFocus: true
    });
  },
  oldBlur: function () {
    let mes = wx.getStorageSync('user_Info');
    let oldPassword = mes.password;
    let inputPassword = md5(this.data.oldPassword);
    if (oldPassword == inputPassword) {
      this.setData({ oldChecked: true })
    } else {
      app.showErrorModal('旧密码不正确', '提示');
    }
    this.setData({ oldFocus: false })
  },
  newFocus: function (e) {
    this.setData({
      newFocus: true
    });
  },
  newBlur: function () {
    this.setData({ newFocus: false })
  },
  againFocus: function (e) {
    this.setData({
      againFocus: true
    });
  },
  againBlur: function () {
    let newPassword = this.data.newPassword;
    let againPassword = this.data.againPassword;
    if (newPassword == againPassword) {
      this.setData({ newCheck: true })
    }
    else {
      app.showErrorModal('俩次密码不同', '提示');
    }
    this.setData({ againFocus: false })
  },
  // 提交按钮
  bind: function () {
    var that = this;
    if (that.data.newPassword != that.data.againPassword) {
      app.showErrorModal('两次密码不同', '修改失败');
    }
    else if ((that.data.newPassword == '') || (that.data.againPassword == '')) {
      app.showErrorModal('密码不能为空', '修改失败');
    }
    else {
      let mes = wx.getStorageSync('user_Info');
      let oldPassword = md5(that.data.oldPassword)
      let againPassword = that.data.againPassword
      let password = md5(againPassword);
      var data = {
        studentNum: mes.studentNum,
        oldPassword: oldPassword,
        newPassword: password
      };
      var url = "/student/changePwd";
      app.showLoadToast('修改中');
      app.putRequest(url, data, function (res) {
        wx.hideToast();
        let status = res.data.status;
        if (status == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
          let jfstatus = wx.getStorageSync("user_Info").jfstatus;
          var message = {
            studentNum: mes.studentNum,
            password: againPassword,
            status: 1,
            jfstatus: jfstatus
          };
          wx.setStorageSync('user_Info', message);
          wx.navigateBack({
              delta: 1,
            })
        } else {
          let msg = res.data.msg;
          app.showErrorModal(msg)
        }
      })
    }
  }
})