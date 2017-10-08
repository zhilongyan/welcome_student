// pages/myClass/myLeader.js
let app = getApp();
Page({
  data: {
    teacher: {},
    student: {},
    teacherStatus : true,
    studentStatus : true

  },
  onLoad: function (options) {
    app.showLoadToast();
    let student = wx.getStorageSync('student_Info');
    let majorbh = student.majorbh;
    let that = this;
    let class_id = student.class;
    let teacherbh = student.teacherbh;
    var data = {
      teacherbh:student.teacherbh
    };
    // 还未分配导员
    if (teacherbh == ''){
      that.setData({teacherStatus : false})
    }else{
      var data = {
        teacherbh: teacherbh
      };
      app.getRequest('/teacher/teacherSelect', data, function (res) {
        let status = res.data.status;
        if (status == 1) {
          console.log("=============导员信息==========")
          console.log(res);
          let message = res.data.data[0];
          
          let phone = message.phone;
          if(phone){
            let phone1 = phone.substring(0, 3);
            let phone2 = phone.substring(3, 7);
            let phone3 = phone.substring(7, 11);
            message.phone = phone1 + "-" + phone2 + "-" + phone3
          }
          that.setData({ teacher: message })
        } else {
          let msg = res.data.msg;
          app.showErrorModal(msg)
        }
      })
    }
 
    var stuData = {
      majorbh: majorbh,
      class: class_id
    };
    app.getRequest('/sub/subSelect', stuData, function (res) {
      wx.hideToast();
      let status = res.data.status;
      if (status == 1) {
        console.log("==============小班信息===============");
        console.log(res)
        // 还未分配小班
        if(res.data.data.length == 0){
          that.setData({ studentStatus: false })
        }else{
          let message = res.data.data[0];
          let phone = message.phone;
          if(phone){
            let phone1 = phone.substring(0, 3);
            let phone2 = phone.substring(3, 7);
            let phone3 = phone.substring(7, 11);
            message.phone = phone1 + "-" + phone2 + "-" + phone3;
          }
          that.setData({ student: message })
        }
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  },
  callNum: function (e) {
    let phone = e.target.dataset.phone;
    console.log("拨打电话")
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  }
})