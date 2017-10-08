// pages/login/login_EML.js
let app = getApp();
let interval;
Page({
  data: {
    time: 60,
    phoneIcon: true,
    phoneStatus: false,
    codeText: "发送验证码",
    finishDisabled: true
  },
  // 发送验证码按钮
  sendCode: function () {
    let that = this;
    // 验证手机号是否正确
    let phoneStatus = that.data.phoneStatus;
    if (phoneStatus) {
      console.log("==========发送验证码==============")
      interval = setInterval(this.timekeeper, 1000);
      let phoneNum = that.data.phoneNum;
      let data = {
        mobile: phoneNum,
        templateid: 3059309
      };
      app.postRequest("/sms/SmsCode", data, function (res) {
        let status = res.data.status;
        if (status == 1) {
          console.log("==============发送验证码成功================")
        } else {
          console.log(res)
          let msg = res.data.msg;
          app.showErrorModal(msg);
        }
      })
    } else {
      console.log("==============手机号有误==============")
      that.setData({ phoneIcon: false })
      return;
    }
  },
  // 计时
  timekeeper: function () {
    let time = this.data.time;
    if (time > 0) {
      time--;
      this.setData({ time: time })
    }
    else {
      clearInterval(interval);
      this.setData({ time: 60, codeText: "重新发送" })
    }
  },
  // 手机号码框
  phoneNum: function (e) {
    let phoneNum = e.detail.value;
    if (app.judgePhoneNum(phoneNum)) {
      // 因为没有做验证，所以这里加上了finishDisabled: false  
      this.setData({ phoneNum: phoneNum, phoneStatus: true, phoneIcon: true, finishDisabled: false  })
    } else {
      this.setData({ phoneStatus: false, phoneIcon: false })
    }
  },
  // 验证码框
  code: function (e) {
    let code = e.detail.value;
    this.setData({ code: code })
  },
  // 
  codeLength: function (e) {
    let code = e.detail.value;
    if (code.length == 6) {
      this.setData({ finishDisabled: false })
    }
  },
  // 提交按钮
  // bind: function () {
  //   var that = this;
  //   var phone = that.data.phoneNum;
  //   let code = that.data.code;
  //   let data = {
  //     mobile: phone,
  //     smsCode: code,
  //   }
  //   app.postRequest('/sms/code_yz', data, function (res) {
  //     let status = res.data.status;
  //     if (status == 1) {
  //       // 绑定手机号
  //       let studentnum = wx.getStorageSync('user_Info').studentNum;
  //       let updateData = {
  //         phone: phone,
  //         studentNum: studentnum
  //       }
  //       app.putRequest("/student/stuUpdate", updateData, function (res) {
  //         let status = res.data.status;
  //         if (status == 1) {
  //           wx.showModal({
  //             title: '提示',
  //             content: '绑定手机号成功，部分信息需要补充以便相互交流，是否前往补充信息？',
  //             cancelText: '以后再说',
  //             confirmText: '前去补充',
  //             success: function (res) {
  //               if (res.confirm) {
  //                 wx.navigateTo({
  //                   url: '../login/login_code_Info_PS',
  //                 })
  //               }
  //               else {
  //                 wx.redirectTo({
  //                   url: '../login/login',
  //                 })

  //               }
  //             }
  //           })
  //         }else{
  //           let msg = res.data.msg;
  //           app.showErrorModal(msg)
  //         }
  //       })
  //     } else {
  //       let msg = res.data.msg;
  //       app.showErrorModal(msg);
  //     }

  //   })
  // }
  bind: function () {
    var that = this;
    var phone = that.data.phoneNum;
    let studentnum = app.studentNum;
    let updateData = {
      phone: phone,
      studentNum: studentnum,
      status : 1,
      jfstatus: 0
    }
    app.putRequest("/student/stuUpdate", updateData, function (res) {
      let status = res.data.status;
      if (status == 1) {
        let user = wx.getStorageSync("user_Info");
        user.status = 1;
        wx.setStorageSync("user_Info", user);
        wx.showModal({
          title: '提示',
          content: '绑定手机号成功，部分信息需要补充以便相互交流，是否前往补充信息？',
          cancelText: '以后再说',
          confirmText: '前去补充',
          success: function (res) {
            if (res.confirm) {
              app.getStudentMes(studentnum, function (res) {
                app.usecar = res.usecar;
                wx.navigateTo({
                  url: '../login/login_code_Info_PS',
                })
              });

            }
            else {
              app.getStudentMes(studentnum, function (res) {
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
          }
        })
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  }
})