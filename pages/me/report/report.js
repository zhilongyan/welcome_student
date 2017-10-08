// pages/me/resport/resport.js
let app = getApp();
let _server = app._server;
Page({
  data: {
    disabled: true
  },
  onLoad: function () {
    app.showLoadToast();
    let that = this;
    this.judgeDorm(function(){
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          wx.hideToast();
          var latitude = res.latitude
          var longitude = res.longitude;
          var lati = Math.abs(latitude - 38.382084);
          var longi = Math.abs(longitude - 117.423065);
          console.log(lati);
          console.log(longi)
          if (lati > 0.1 || longi > 0.1) {
            console.log("=========不在规定范围内===========");
            wx.showModal({
              showCancel: false,
              title: '',
              content: '您不在校园范围内，无法完成报到',
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../wode/wode'
                  })
                }
              }
            })
          } else {
            that.setData({ disabled: false });
          }
        },
        fail: function (res) {
          wx.navigateTo({
            url: '../../fail/fail',
          })
        }
      })
    });
  },
  report: function () {
    let studentNum = app.studentNum;
    let data = {
      studentNum: studentNum,
      report: 1
    }
    app.putRequest('/student/stuUpdate', data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        let student = wx.getStorageSync('student_Info')
        student.report = 1;
        wx.setStorageSync("student_Info", student);
        wx.showModal({
          title: '提示',
          content: '报到成功',
          showCancel: false,
          success: function (res) {
            wx.switchTab({
              url: "../wode/wode",
            })
          }
        })
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg, "出错了")
      }
    })
  },

  // 判断用户缴费状态,未缴费的不允许报到
  judgeJf: function () {
    let that = this;
    let studentnum = app.studentNum;
    let data = {
      jstudentnum: studentnum
    }
    app.showLoadToast();
    app.getRequest("/jf/stuJf", data, function (res) {
      wx.hideToast();
      console.log(res)
      let status = res.data.status;
      if (status == 1) {
        let jstatus = res.data.data[0].jstatus;
        // 未提供缴费单号
        // if (jstatus == 0) {
        //   console.log("============未提供缴费单=============")
        // }
        // 审核通过
        if (jstatus == 1) {
          console.log("===============审核通过==============")
          that.getDorm()
        }
        // 审核中
        // else if (jstatus == 2) {
        //   console.log("================审核中==============")
        // }
        // 未通过审核
        else {
          wx.showModal({
            showCancel: false,
            title: '',
            content: '您未完成缴费，暂时不可以报到',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../wode/wode'
                })
              }
            }
          })
        }
      }else{
        let msg = res.data.msg;
        app.showErrorModal(msg, function () {
          wx.switchTab({
            url: '../wode/wode',
          })
        });
      }
    })
  },
  judgeDorm: function (cb) {
    let studentNum = app.studentNum;
    let data = {
      rstudentnum: studentNum
    };
    app.getRequest("/room/stuRoomSelect", data, function (res) {
      let status = res.data.status;
      if (status) {
        console.log("======学生是否选过宿舍======")
        console.log(res);
        if (res.data.data.length) {
          console.log("====学生已经选过宿舍了====")
          typeof cb == "function" && cb()
        } else {
          wx.showModal({
            showCancel: false,
            title: '',
            content: '您未选宿舍，暂时不可以报到',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../wode/wode'
                })
              }
            }
          })
        }
      } else {
        let msg = res.data.msg;
        console.log("====查看学生是否选宿舍发生错误======")
        app.showErrorModal(msg,function(){
          wx.switchTab({
            url: '../wode/wode',
          })
        })
      }
    })
  }
})