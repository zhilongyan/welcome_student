let app = getApp();
let _server = app._server;
Page({
  data: {
  },
  onLoad: function (options) {
    // let student = wx.getStorageSync("student_Info");
    // let jiaofeibh = student.jiaofeibh;
    // let jclass = student.class;
    // let jmajor = student.majorname;
    // if(jiaofeibh){
    //   let img = _server + "/Public/Uploads/"+ jmajor + jclass +"/" + student.studentnum + ".png"
    //   this.setData({ sureStatus:true,list:jiaofeibh,img:img})
    // }else{
    //   this.setData({sureStatus:false})
    // }
    this.judgeJf()
  },
  // 判断用户缴费状态
  judgeJf: function () {
    // 先判断是否身份认证
    let student = wx.getStorageSync("student_Info");
    let sfzstatus = student.sfzstatus;
    if (sfzstatus == 1) {
      let that = this;
      let studentnum = app.studentNum;
      let data = {
        jstudentnum: studentnum
      };
      let majorname = wx.getStorageSync("student_Info").majorname;
      that.setData({ majorname: majorname })
      app.showLoadToast();
      app.getRequest("/jf/stuJf", data, function (res) {
        wx.hideToast();
        console.log(res)
        let status = res.data.status;
        if (status == 1) {
          let data = res.data.data[0];
          let jstatus = data.jstatus;
          let img = data.jimage;
          let list = data.jnum
          that.setData({ jstatus: jstatus, img: img, list: list })
          // 未提供缴费单号
          if (jstatus == 0) {
            console.log("============未提供缴费单=============")
          }
          // 审核通过
          else if (jstatus == 1) {
            console.log("===============审核通过==============");

          }
          // 审核中
          else if (jstatus == 2) {
            console.log("================审核中==============")
          }
          // 未通过审核
          else {
            console.log("===============未通过审核=============")
            that.setData({ jfInfo: data.jinfo });
          };
          // 获取总共需要缴费的数目

          // let totalMoney = Number(data.jfzhusufei) + Number(data.jftijianfei) + Number(data.jfxuefei) + Number(data.jfzafei);
          that.setData({ jfzhusufei: Number(data.jfzhusufei), jfjiaocaifei: Number(data.jfjiaocaifei), jfxuefei: Number(data.jfxuefei), jfzafei: Number(data.jfzafei) })
        } else {
          let msg = res.data.msg;
          app.showErrorModal(msg, function () {
            wx.switchTab({
              url: '../index/index',
            })
          });
        }
      })
    } else {
      app.showErrorModal("请先通过身份认证", function () {
        wx.switchTab({
          url: '../index/index',
        })
      })
    }

  },
  // 选择图片
  changeImg: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({ img: tempFilePaths[0] })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  // 确认提交按钮
  sure: function () {
    let img = this.data.img;
    let list = this.data.list;
    if (list == undefined) {
      return
    }
    if (img == undefined) {
      app.showErrorModal("请给你的收费单拍照")
      return;
    }
    wx.showModal({
      content: '请确定好您的单号',
      success: function (res) {
        if (res.confirm) {
          console.log("上传")
          let student = wx.getStorageSync("student_Info")
          let session_id = wx.getStorageSync("session_id");

          wx.uploadFile({
            url: _server + '/jf/jfdImg',
            filePath: img,
            name: student.studentnum,
            formData: {
              "Content-Type": "application/x-www-form-urlencoded",
              name: student.studentnum,
              session_id: session_id,
              jclass: student.class,
              jmajor: student.majorname
            },
            success: function (res) {
              console.log(res);
              // 将json数据转换成对象
              let data = JSON.parse(res.data);
              let jfdata = {
                jstudentnum: student.studentnum,
                jnum: list,
                jstatus: 2,
                jimage: data.data,
              }
              if (data.status == 1) {
                app.putRequest('/jf/jfdUpdate', jfdata, function (res) {
                  wx.hideToast();
                  let status = res.data.status;
                  if (status == 1) {
                    wx.showToast({
                      title: '成功',
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
              else {
                let msg = data.msg;
                app.showErrorModal(msg)
              }
            },
            fail: function (res) {
              let msg = res.errMsg;
              app.showErrorModal(msg)
            }
          })


        } else if (res.cancel) {
          return
        }
      }
    })

  },
  list: function (e) {
    let value = e.detail.value;
    this.setData({ list: value })
  },
  // 修改
  modify: function () {
    this.setData({ jstatus: 0 })
  }
})