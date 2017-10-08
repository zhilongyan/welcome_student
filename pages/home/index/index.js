let app = getApp();
Page({
  data: {
    symbol: [
      { name: '校园概况', img: '/image/home/icon-fuli.png', url: "../work/work" },
      { name: '校园资讯', img: '/image/home/icon-fujin.png', url: "../school/school" },

      { name: '公交信息', img: '/image/home/icon-qiandao.png', url: "../bus/bus" },
      { name: '酒店美食', img: '/image/home/icon-muma.png', url: "../hotel/hotel" },

      { name: '选宿舍', img: '/image/home/icon-tiyu.png', url: "../dorm/dorm" },
      // { name: '查看宿舍', img: '/image/home/icon-tiyu.png', url: "../dorm/seedorm" },
      { name: '最优路线', img: '/image/home/icon-xingxing.png', url: "../route/route" },

      { name: '缴费单', img: '/image/home/icon-zhanhui.png', url: "../payment/paymentQuestion" },
      { name: '助学金', img: '/image/home/icon-qinzi.png', url: "../money/money" },
    ],
    schoolStatus: true,
    teacherStatus: false,
    studentStatus: false
  },
  onLoad: function (options) {
    // 判断用户是否登陆
    let student = wx.getStorageSync('user_Info');
    if (student.status) {
      console.log("===========学生登陆==========");
      app.studentNum = student.studentNum;
      // 获取其信息
      app.getStudentMes(student.studentNum, function (res) {
        let usecar = res.usecar;
        app.usecar = usecar;
        if (usecar == 1) {
          that.getPosition();
        }
      });
    } else {
      console.log("===========未登陆==========");
      // 没有登陆，跳到登录页
      wx.redirectTo({
        url: '../../login/login',
      })
      return;
    }

    // 加载swiper里面需要的图片
    let that = this;
    for (let i = 1; i <= 3; i++) {
      wx.getStorage({
        key: 'swiper' + i,
        success: function (res) {
          let url = res.data;
          // let name = "imgUrls["+(i-1)+"]";
          // 将图片地址更新到数据层中用来展示    因为setData中不能字符串拼接，所以只能这么弄了
          switch (i) {
            case 1: that.setData({ "imgUrls[0]": url }); break;
            case 2: that.setData({ "imgUrls[1]": url }); break;
            case 3: that.setData({ "imgUrls[2]": url }); break;
          }
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
    };
  },
  onShow: function () {
    let studentNum = app.studentNum;
    if (studentNum == "") {
      return;
    } else {
      // 判断是否选了宿舍了     这里是用来判断每次页面显示后是否选宿舍了，主要用来判断用户点击选宿舍之后的情况
      this.judgeBorm();
      // 获取公告
      this.getNotice();
      // 判断是否查看过缴费单
      this.judgeJf();
    }

  },
  // 点击跳转事件
  click: function (e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  // 获取公告
  getNotice: function () {
    let that = this;
    // 获取学校公告
    app.getRequest('/notice/noticeSelect', {
      writerbh: "admin"
    }, function (res) {
      console.log("======================公告内容=====================");
      console.log(res);
      let status = res.data.status;
      if (status == 1) {
        let message = res.data.data;
        for (let i = 0; i < message.length; i++) {
          message[i].time = that.getDate(message[i].time);
        };
        that.setData({ notice: message })
      } else {
        that.setData({ notice: [], schoolNoticeTitle: "" })
        let msg = res.data.msg
        console.log(msg);
        // app.showErrorModal(msg);
      }
    })
    let student = wx.getStorageSync('student_Info');
    let teacherbh = student.teacherbh;
    console.log("=================导员信息==================")
    console.log(teacherbh)
    if (teacherbh != "") {
      // 获取导员公告，先获得导员账号
      app.getRequest('/notice/noticeSelect', {
        writerbh: student.teacherbh
      }, function (res) {
        console.log("======================公告内容=====================");
        console.log(res);
        let status = res.data.status;
        if (status == 1) {
          let message = res.data.data;
          for (let i = 0; i < message.length; i++) {
            message[i].time = that.getDate(message[i].time);
          };
          that.setData({ teacherNotice: message })
        } else {
          that.setData({ teacherNotice: [], teacherNoticeTitle: "" })
          let msg = res.data.msg
          console.log(msg);
          // app.showErrorModal(msg);
        }
      })
    } else {
      that.setData({ teacherNotice: [] })
    }
    console.log("=================小班信息==================")
    console.log(student.majorbh)

    console.log(student.class)
    app.getRequest("/sub/subSelect", {
      majorbh: student.majorbh,
      class: student.class
    }, function (res) {
      let status = res.data.status;
      if (status == 1) {
        if (res.data.data.length > 0) {
          let subteacherbh = res.data.data[0].subteacherbh;
          // 获取小班公告
          app.getRequest('/notice/noticeSelect', {
            writerbh: subteacherbh
          }, function (res) {
            console.log("======================公告内容=====================");
            console.log(res);
            let status = res.data.status;
            if (status == 1) {
              let message = res.data.data;
              for (let i = 0; i < message.length; i++) {
                message[i].time = that.getDate(message[i].time);
              };
              that.setData({ stuNotice: message })
            } else {
              that.setData({ stuNotice: [], stuNoticeTitle: "" })
              let msg = res.data.msg
              app.showErrorModal(msg);
            }
          })
        }
        else {
          that.setData({ stuNotice: [], stuNoticeTitle: "" })
        }


      } else {
        let msg = res.data.msg;
        console.log(msg);
        // app.showErrorModal(msg);
      }

    })
  },
  // 判断已经选宿舍了
  judgeBorm: function () {
    let that = this;
    // let student = wx.getStorageSync("student_Info");
    // if (student) {
    //   var dorm = student.dormbh;
    //   if (dorm != "") {
    //     that.setData({ "symbol[4]": { name: '查看宿舍', img: '/image/home/icon-tiyu.png', url: "../dorm/seedorm?dorm=" + dorm } })
    //   } else {
    //     that.setData({ "symbol[4]": { name: '选宿舍', img: '/image/home/icon-tiyu.png', url: "../dorm/dorm" }, })
    //   }
    // } else {
    //   // 从登陆页面进来的，缓冲中还没有个人信息
    //   let studentNum = wx.getStorageSync('user_Info').studentNum;
    //   app.getStudentMes(studentNum, function (e) {
    //     var dorm = e.dormbh;
    //     if (dorm && dorm.length > 0) {
    //       that.setData({ "symbol[4]": { name: '查看宿舍', img: '/image/home/icon-tiyu.png', url: "../dorm/seedorm?dorm=" + dorm } })
    //     } else {
    //       that.setData({ "symbol[4]": { name: '选宿舍', img: '/image/home/icon-tiyu.png', url: "../dorm/dorm" }, })
    //     }
    //   })
    // }
    let dorm = wx.getStorageSync("dorm");
    if (dorm) {
      that.setData({ "symbol[4]": { name: '查看宿舍', img: '/image/home/icon-tiyu.png', url: "../dorm/seedorm?dorm=" + dorm } })
    } else {
      that.setData({ "symbol[4]": { name: '选宿舍', img: '/image/home/icon-tiyu.png', url: "../dorm/dorm" }, })
    }
  },
  //通知  改变状态
  schoolChange: function () {
    this.setData({
      schoolStatus: true,
      teacherStatus: false,
      studentStatus: false
    })
  },
  teacherChange: function () {
    this.setData({
      schoolStatus: false,
      teacherStatus: true,
      studentStatus: false
    })
  },
  studentChange: function () {
    this.setData({
      schoolStatus: false,
      teacherStatus: false,
      studentStatus: true
    })
  },
  // 判断是否发送到站位置
  getPosition: function () {
    let studentNum = app.studentNum;
    app.getRequest("/position/poSelect", { pstudentNum: studentNum }, function (res) {
      let status = res.data.status;
      if (status == 1) {
        console.log("==================到站信息===================")
        console.log(res);
        if (res.data.data.length > 0) {
          let pstatus = res.data.data[0].pstatus;
          if (pstatus == 1) {
            app.usecar = 3;
          }
        }

      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  },
  // 获取时间  格式：17/5/5
  getDate: function (time) {
    var now = new Date(time * 1000);
    var year = now.getYear() - 100;
    var month = now.getMonth() + 1;
    var date = now.getDate();
    return year + "/" + month + "/" + date;
  },
  // 判断是否查看过缴费单了
  judgeJf: function () {
    let user = wx.getStorageSync("user_Info");
    let jfstatus = user.jfstatus;
    if (jfstatus) {
      this.setData({ "symbol[6]": { name: '缴费单', img: '/image/home/icon-zhanhui.png', url: "../payment/payment" }, })
    }
  }
})