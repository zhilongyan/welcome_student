let app = getApp();
let _server = app._server;
// pages/home/dorm/dorm.js；
let student;
let studentNum;
let studentSex;
Page({
  data: {
    floorArr: [],
    floorIndex: -1,
    storeyArr: [],
    storeyIndex: -1,
    roomArr: [],
    roomIndex: -1,
    bedArr: [],
    bedIndex: -1,
    alreadyLive: [
    ],
    studentSex: "",
    jstatus: 1
  },

  onLoad: function (options) {
    // let studentMes = wx.getStorageSync('user_Info');
    // app.getLoginMes(studentMes.studentNum);
    // 先获取是否缴费了，没有的话不允许选宿舍；
    this.judgeJf();
    // 查看学生是否选过宿舍了
    this.judgeDorm(this.getStorey);
    // 判断当前用户性别
    student = wx.getStorageSync('student_Info');
    // let sex = student.sex;
    studentNum = student.studentnum;
    // 性别 男1女0
    // if (sex == '男') {
    //   studentSex = 1;
    // }
    // else {
    //   studentSex = 0;
    // }
    console.log("==============学生性别==================")
    console.log(student.sex + studentSex)
    // 第一次加载进来时获取楼信息
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000,
      mask: true,
    })

  // ();
  },

  // 获取楼的信息
  // 传输数据 ： 性别，专业，班级
  getStorey: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000,
      mask: true,
    })
    let that = this;
    let data = {
      rsex: student.sex,
      // major: student.major,
      major: student.majorname,
      classbh: student.class
    };
    app.getRequest('/room/storey', data, function (res) {
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        let storeyArr = res.data.data;
        that.setData({ storeyArr: storeyArr })
      }
      else if (status == 4) {
        let msg = res.data.msg;
        app.showErrorModal(msg, function () {
          wx.navigateBack({
            delta: 1
          })
        });
      }
      else {
        let msg = res.data.msg;
        app.showErrorModal(msg, "楼问题");
      }
    })
  },
  //获取楼层信息
  getFloor: function (storey) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000,
      mask: true,
    })
    let that = this;
    let data = {
      rsex: student.sex,
      major: student.majorname,
      classbh: student.class,
      storey: storey
    };
    app.getRequest('/room/floor', data, function (res) {
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        let floorArr = res.data.data
        that.setData({ floorArr: floorArr })
      }

      else {
        let msg = res.data.msg;
        app.showErrorModal(msg, "楼层问题");
      }
    })
  },

  // 获取宿舍信息
  getRoom: function (storey, floor) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000,
      mask: true,
    })
    let that = this;
    let data = {
      rsex: student.sex,
      major: student.majorname,
      classbh: student.class,
      storey: storey,
      floor: floor,
    };
    app.getRequest('/room/dorm', data, function (res) {
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        console.log(res)
        let roomArr = res.data.data;
        that.setData({ roomArr: roomArr })
      }
      else {
        let msg = res.data.msg;
        app.showErrorModal(msg, "宿舍问题");
      }
    })
  },
  // 获取床位的信息
  getBed: function (storey, floor, room) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000,
      mask: true,
    })
    let that = this;
    let data = {
      rsex: student.sex,
      major: student.majorname,
      classbh: student.class,
      storey: storey,
      floor: floor,
      dormbh: room
    };
    app.getRequest('/room/bed', data, function (res) {
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        console.log("==================当前床位信息======================")
        console.log(res);
        let bedArr = res.data.data;
        that.setData({ bedArr: bedArr })
      }
      else {
        let msg = res.data.msg;
        app.showErrorModal(msg, "床位问题");
      }
    })
  },
  // 获取当前入住人员的信息
  getAlreadyLive: function (room) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000,
      mask: true,
    })
    let that = this;
    let data = {
      dormbh: room
    };
    // app.getRequest('/student/stuSelect', data, function (res) {
    //   wx.hideToast()
    //   let status = res.data.status;
    //   if (status == 1) {
    //     let stuMes = res.data.data;
    //     for (let i = 0; i < stuMes.length; i++) {
    //       stuMes[i].address = app.regularAddress(stuMes[i].address);
    //       stuMes[i].tag = app.changeCharacter(stuMes[i].tag);
    //     }
    //     that.setData({ alreadyLive: stuMes })
    //   } else {
    //     that.setData({ alreadyLive: [] })
    //   }
    // })
    app.getRequest('/room/stuRoomSelect', data, function (res) {
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        console.log("===当前选择本宿舍的人=====");
        console.log(res);
        let stuMes = res.data.data;
        for (let i = 0; i < stuMes.length; i++) {
          stuMes[i].address = app.regularAddress(stuMes[i].address);
          stuMes[i].tag = app.changeCharacter(stuMes[i].tag);
        }
        that.setData({ alreadyLive: stuMes })
      } else {
        that.setData({ alreadyLive: [] })
      }
    })
  },
  //选择楼
  storeyChange: function (e) {
    console.log(e)
    let originalStorey = this.data.storeyIndex;
    let value = e.detail.value / 1;
    if (value == originalStorey) {
      return;
    }
    this.setData({ storeyIndex: value });
    let storey = this.data.storeyArr;
    // let floor = this.data.floorArr;
    // let floorIndex = this.data.floorIndex;
    let storeyNum = storey[value] / 1;
    // let  = this.data.storeyArr[value] / 1;

    // 先将楼层和宿舍的信息复原
    this.setData({
      floorArr: [],
      floorIndex: -1,
      roomArr: [],
      roomIndex: -1,
      bedArr: [],
      bedIndex: -1,
      alreadyLive: [
      ]
    })
    this.getFloor(storeyNum)
  },
  //选择楼层
  floorChange: function (e) {
    console.log("===============选择楼=================")
    console.log(e);
    let value = e.detail.value;
    let floorIndex = this.data.floorIndex;
    if (value == floorIndex) {
      return;
    }
    // 先将宿舍的信息复原
    this.setData({
      roomArr: [],
      roomIndex: -1,
      bedArr: [],
      bedIndex: -1,
      alreadyLive: [
      ]
    })
    this.setData({ floorIndex: value });
    let storey = this.data.storeyArr;
    let storeyIndex = this.data.storeyIndex;
    let storeyNum = storey[storeyIndex] / 1;
    let floor = this.data.floorArr;
    let floorNum = floor[value] / 1;
    this.getRoom(storeyNum, floorNum);
    // 
  },
  // 选择宿舍
  roomChange: function (e) {
    console.log(e)
    let value = e.detail.value;
    this.setData({ roomIndex: value });
    let storey = this.data.storeyArr;
    let storeyIndex = this.data.storeyIndex;
    let storeyNum = storey[storeyIndex] / 1;
    let floor = this.data.floorArr;
    let floorIndex = this.data.floorIndex;
    let floorNum = floor[floorIndex] / 1;
    let roomNum = this.data.roomArr[value];
    this.getBed(storeyNum, floorNum, roomNum);
    this.getAlreadyLive(roomNum);
  },
  // 选择床位
  bedChange: function (e) {
    let value = e.detail.value;
    this.setData({ bedIndex: value })
  },
  // // 获取已经入住此宿舍的学生的详细情况
  // getStuMes: function () {
  //   //获取学生id
  // }

  // 确认入住
  sureCheck: function () {
    let that = this;
    let mes = this.data;
    let dormbh = mes.roomArr[mes.roomIndex];
    let storey = mes.storeyArr[mes.storeyIndex];
    let floor = mes.floorArr[mes.floorIndex];
    let bed = mes.bedArr[mes.bedIndex];
    if (typeof bed != "string" ||typeof dormbh != "string") {
      app.showErrorModal("您所选择的宿舍信息不完整")
      return;
    }
    let data = {
      dormbh: dormbh,
      rstudentnum: studentNum,
      bedbh: bed,
      rsex: student.sex,
      // major: student.majorname,
      // classbh: student.class,
      // storey: storey,
      // floor: floor
    };
    app.putRequest('/room/liveDorm', data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        // 更新缓冲

        let dorm = dormbh;
        wx.setStorageSync("dorm", dorm);
        wx.showToast({
          title: '入住成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.redirectTo({
                url: 'seedorm?dorm=' + dormbh,
              })
            }, 2000)
          }
        })
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  },
  // 判断用户缴费状态,未缴费的不允许选择宿舍
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
  // 查看该学生是否选了宿舍   
  // 防止学生已经选了宿舍但是换手机登陆
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
          let dormbh = res.data.data[0].dormbh;
          wx.setStorageSync("dorm", dormbh)
          wx.redirectTo({
            url: 'seedorm'
          })
        }else{
          typeof cb == "function" && cb();
        }
      } else {
        let msg = res.data.msg;
        console.log("====查看学生是否选宿舍发生错误======")
        console.log(msg);
      }
    })
  }
})