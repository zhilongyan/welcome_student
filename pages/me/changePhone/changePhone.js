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
    let student = wx.getStorageSync("student_Info");
    let phoneNum = student.phone;
    let studentNum = student.studentnum;
    that.setData({ oldPhone: phoneNum, studentNum: studentNum });
    console.log("==========发送验证码==============")
    interval = setInterval(this.timekeeper, 1000);
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
  //   var oldPhone = that.data.oldPhone;
  //   let code = that.data.code;
  //   let data = {
  //     mobile: oldPhone,
  //     smsCode: code,
  //   }
  //   let phoneStatus = that.data.phoneStatus;
  //   if (phoneStatus) {
  //     let newPhone = that.data.phoneNum;
  //     let studentNum = that.data.studentNum;
  //     app.postRequest('/sms/code_yz', data, function (res) {
  //       let status = res.data.status;
  //       if (status == 1) {
  //         // 绑定手机号
  //         let updateData = {
  //           phone: newPhone,
  //           studentNum: studentNum
  //         }
  //         app.putRequest("/student/stuUpdate", updateData, function (res) {
  //           let status = res.data.status;
  //           if (status == 1) {
  //             wx.showToast({
  //               title: '改绑成功',
  //               icon: 'success',
  //               duration: 1000
  //             })
  //             setTimeout(function () {
  //               wx.navigateBack({
  //                 delta: 1
  //               })
  //             }, 1000)
  //           } else {
  //             let msg = res.data.msg;
  //             app.showErrorModal(msg)
  //           }
  //         })
  //       } else {
  //         let msg = res.data.msg;
  //         app.showErrorModal(msg);
  //       }
  //     })
  //   } else {
  //     app.showErrorModal("请输入正确的手机号");
  //   }

  // }
  bind : function(){
    let student = wx.getStorageSync("student_Info");
    let studentNum = student.studentnum;
    let newPhone = this.data.phoneNum;
    let updateData = {
      phone: newPhone,
      studentNum: studentNum
    }
    app.putRequest("/student/stuUpdate", updateData, function (res) {
      let status = res.data.status;
      if (status == 1) {
        student.phone = newPhone;
        wx.setStorageSync("student_Info",student);
        wx.showToast({
          title: '改绑成功',
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
})