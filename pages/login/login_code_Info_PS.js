// pages/login/login_code_Info_PS.js
var app = getApp();
Page({
  data: {
    // wechatStatus:true ,
    emailStatus: true,
    text: '添加'
  },
  onLoad: function (e) {
    // 判断是否是从"我的"页面进来的
    if (e.from) {
      this.setData({ from: "我的" });
      var student = wx.getStorageSync('student_Info');
      let tag = app.changeCharacter(student.tag);
      if (tag.length > 0) {
        this.setData({ text: '改变' })
      }
      this.setData({
        qq: student.qq,
        wechat: student.wechat,
        email: student.mail,
        phone: student.phone,
        tag: tag,
      })
    }
  },
  onShow: function (e) {
    var student = wx.getStorageSync('student_Info');
    let tag = app.changeCharacter(student.tag);
    if (tag.length > 0) {
      this.setData({ text: '改变' })
    }
    this.setData({
      tag: tag,
    })
  },
  // 确认完善按钮
  formSubmit: function (e) {
    console.log(e);
    let _this = this;
    let emailStatus = this.data.emailStatus;
    if (!emailStatus) {
      app.showErrorModal("请添加正确的邮箱");
      return;
    }
    app.showLoadToast('完善中');
    var student = wx.getStorageSync('student_Info')
    var qq = e.detail.value.qqNum;
    var wechat = e.detail.value.wechat;
    var mail = e.detail.value.email;
    var data = {
      studentNum: student.studentnum,
      qq: qq,
      wechat: wechat,
      mail: mail
    }
    app.putRequest('/student/stuUpdate', data, function (res) {
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        student.qq = qq;
        student.wechat = wechat;
        student.mail = mail;
        wx.setStorageSync('student_Info', student);
        let fromName = _this.data.from;
        if (fromName) {
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
        } else {
          wx.switchTab({
            url: "../home/index/index",
          })
        }
      }
      else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  },
  // 检查email输入框是否是符合规范
  emailBlur: function (e) {
    let email = e.detail.value;
    if (email == '') {
      return
    } else {
      if (!app.judgeEmail(email)) {
        this.setData({ emailStatus: false })
      } else {
        this.setData({ emailStatus: true })
      }
    }
  },
  // 用来检查微信输入框中是否含有汉字
  wechatBlur: function (e) {
    let wechat = app.judgeChinese(e.detail.value);
    this.setData({
      wechat: wechat
    })
  },
  // 点击添加性格标签
  character: function () {
    wx.navigateTo({
      url: '../me/character/character',
    })
  },
  qq: function (e) {
    let qq = e.detail.value;
    this.setData({ qq: qq })
  }
})