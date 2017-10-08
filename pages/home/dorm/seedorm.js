// pages/home/dorm/seedorm.js
let app = getApp();
Page({
  data: {
    alreadyLive: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // this.judgeJf();
    this.getDorm()
  },
  // 重新选择宿舍
  again: function () {
    let that = this;
    wx.showModal({
      content: '重新选择宿舍将会清空您现在的宿舍信息，是否重新选择',
      success: function (res) {
        if (res.confirm) {
          let student = wx.getStorageSync('student_Info');
          // let studentNum = app.studentNum;
          // let student = '';
          let person = that.data.alreadyLive;
          // for (let i = 0; i <= person.length; i++) {
          //   let num = person[i].studentnum;
          //   if (num == studentNum) {
          //     student = person[i];
          //     break;
          //   }
          // }
          let dormbh = person[0].dormbh;
          let bedbh = that.data.bed;
          let rsex = student.sex;
          let data = {
            dormbh: dormbh,
            bedbh: bedbh,
            rsex: rsex
          }
          app.putRequest("/room/resetDorm", data, function (res) {
            let status = res.data.status;
            if (status == 1) {
              wx.removeStorageSync('dorm')
              wx.redirectTo({
                url: 'dorm',
              })
            } else {
              let msg = res.data.msg;
              app.showErrorModal(msg);
            }
          })

        } else if (res.cancel) {
          return;
        }
      }
    })
  },
  // 显示个性标签详情
  show: function (e) {
    let index = e.target.dataset.id;
    let data = this.data.alreadyLive;
    data[index].showStatus = false;
    this.setData({ alreadyLive: data });
  },
  // 隐藏详情
  hide: function (e) {
    let index = e.target.dataset.id;
    let data = this.data.alreadyLive;
    data[index].showStatus = true;
    this.setData({ alreadyLive: data });
  },
  // 判断用户缴费状态,未缴费的不允许进宿舍
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
        that.setData({ jstatus: jstatus })
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
          console.log("===============未通过审核=============")
          that.setData({ notJs: "需要审核通过缴费单之后才能查看宿舍具体情况" })
        }
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg, function () {
          wx.switchTab({
            url: '../index/index',
          })
        });
      }
    })
  },
  // 获取当前宿舍人员信息
  getDorm: function () {
    let dormbh = wx.getStorageSync("dorm");
    if (dormbh) {
      let that = this;
      let data = {
        dormbh: dormbh,
        // jstatus:1
      };
      app.getRequest('/room/stuRoomSelect', data, function (res) {
        console.log("==================当前入住学生信息======================")
        console.log(res);
        let status = res.data.status;
        if (status == 1) {
          let stuMes = res.data.data;
          // 没有数据 说明后台被清了，需要重新选宿舍
          if (stuMes.length == 0) {
            wx.removeStorageSync('dorm')
            wx.redirectTo({
              url: 'dorm',
            })
          } else {
            // 判断这宿舍人里有没有此学生，如果没有说明信息被清空，需要重新选择
            let status = stuMes.some(function (item) {
              return item.studentnum == app.studentNum;
            })
            if (status) {
              for (let i = 0; i < stuMes.length; i++) {
                stuMes[i].address = app.regularAddress(stuMes[i].address);
                stuMes[i].bed = stuMes[i].dormbh[0] + stuMes[i].dormbh[1] + stuMes[i].dormbh[2] + stuMes[i].dormbh[3] + '-' + stuMes[i].bedbh;
                stuMes[i].tag = app.changeCharacter(stuMes[i].tag);
                if (stuMes[i].tag.length <= 3) {
                  stuMes[i].hide = true;
                } else {
                  stuMes[i].hide = false;
                }
                stuMes[i].showStatus = true;
                // 是否是本人
                if(app.studentNum == stuMes[i].studentnum){
                  that.setData({bed : stuMes[i].bedbh})
                }
              }
              that.setData({ alreadyLive: stuMes })
            } else {
              wx.removeStorageSync('dorm')
              wx.redirectTo({
                url: 'dorm',
              })
            }
          }

        }
        else {
          let msg = res.data.msg;
          app.showErrorModal(msg)
        }
      })
    } else {
      app.showErrorModal("宿舍还未分配好，请耐心等待", function () {
        wx.switchTab({
          url: '../index/index',
        })
      })
    }

  },
  // 查看宿舍凭证
  voucher: function () {
    wx.navigateTo({
      url: 'voucher?bedbh=' + this.data.bed,
    })
  }
})