//login.js
//获取应用实例
var app = getApp();
let _server = app._server;
var md5 = require("../../utils/md5.min.js");
Page({
  data: {
    remind: '加载中',
    help_status: false,
    userid_focus: false,
    passwd_focus: false,
    // userid: '',
    // userid: '2016974100123',
    angle: 0,
    mode: ["学号","身份证号"],
    modeArr: 0,
    initialPw: ''
  },
  onShow: function () {
    this.setData({ initialPw: '' })
  },
  onReady: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1500);
  },

  bind: function () {
    var _this = this;
    if (!_this.data.userid || !_this.data.passwd) {
      app.showErrorModal('账号及密码不能为空', '提醒');
      return false;
    }
    else {
      app.showLoadToast('登录中');
      let password = _this.data.passwd;
      let num = _this.data.userid;
      this.studentLogin(num, password);
    }
  },


  // 输入框 的设定
  useridInput: function (e) {
    this.setData({
      userid: e.detail.value
    });
    if (e.detail.value.length >= 18) {
      wx.hideKeyboard();
    }
  },
  passwdInput: function (e) {
    let psw = md5(e.detail.value)
    this.setData({
      passwd: psw
    });
  },

  // ......
  inputFocus: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    }
  },

  // 帮助
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  },
  // 登陆   学号登陆和身份证登陆传的数据一样
  studentLogin: function (num, password) {
    let _this = this;
    let data = {
      studentNum: num,
      password: password
    }
    app.postRequest('/student/stuLogin', data, function (res) {
      console.log(res)
      if (res.data.status == 1) {
        // 保存sessionid
        let session_id = res.data.session_id;
        wx.setStorageSync('session_id', session_id)
        let data_mes = {
          studentNum: res.data.studentNum,
          password: password,
          status : 1,
          jfstatus: 0
        }
        app.studentNum = res.data.studentNum;
        wx.setStorageSync('user_Info', data_mes);
        app.getStudentMes(res.data.studentNum, function (res) {
          app.usecar = res.usecar;
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            mask: true,
            duration: 8000
          });
          wx.switchTab({
            url: "../home/index/index",

          })
          wx.hideToast()
          wx.showToast({
            title: '欢迎使用',
            icon: 'success',
            mask: true,
            duration: 1000
          });
        });
      }
      else if (res.data.status == 3 || res.data.status == 2) {
        wx.hideToast();
        app.showErrorModal(res.data.msg, '登录失败');
      }
      else if (res.data.status == 7) {
        let session_id = res.data.session_id;
        wx.setStorageSync('session_id', session_id)
        setTimeout(function () {
          let data_mes = {
            studentNum: res.data.studentNum,
            password: password,
            status : 0,
            jfstatus : 0
          }
          wx.setStorageSync('user_Info', data_mes);
          app.studentNum = res.data.studentNum;
          wx.hideToast();
          let msg = res.data.msg;
          wx.showModal({
            title: '提示',
            content: msg,
            showCancel:false,
            confirmText: '去绑定',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../login/loginSms'
                });
              } else {
                // 返回
              }
            }
          });
        }, 500);
      }
      else {
        wx.hideToast();
        app.showErrorModal(res.data.msg, '登录失败');
      }
    })
  },
  // 学生身份证号登陆
  
  forget: function () {
    wx.navigateTo({
      url: 'forget'
    })
  },
  // 选择登陆方式
  modeChange: function (e) {
    console.log(e)
    let value = e.detail.value / 1;
    this.setData({ modeArr: value })
  },
});