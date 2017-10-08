//app.js
App({
  _server: 'https://api.dysceapp.com/znyx/',
  studentNum: '',
  onShow: function (res) {
    console.log(res);
    let that = this;
    // 程序开始执行俩秒之后开始下载图片，显得不卡
    setTimeout(function () {
      // 下载首页swiper的图片
      for (let i = 1; i <= 3; i++) {
        that.getImage('swiper' + i, '.jpg');
      }
    }, 5000)
  },
  // 发生错误的提示
  showErrorModal: function (content, cb) {
    wx.showModal({
      title: "",
      content: content || '未知错误',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          typeof cb == "function" && cb();
        }
      }
    });
  },
  //提示 加载中
  showLoadToast: function (title, duration, cb) {
    wx.showToast({
      title: title || '加载中',
      icon: 'loading',
      mask: true,
      duration: duration || 10000,
      success: function () {
        typeof cb == "function" && cb();
      }
    });
  },
  // 获得当前登录用户的微信信息
  getUserInfo: function (cb) {
    var that = this;
    //调用登录接口
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            let userInfo = res.userInfo
            typeof cb == "function" && cb(userInfo)
          }
        })
      }
    })
  },
  // 获取当前学生的信息
  getStudentMes: function (studentId = this.studentNum, cb) {
    let that = this;
    let data = {
      studentNum: studentId
    }
    //根据账号获取学生的详细信息i
    this.getRequest('/student/stuSelect', data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        console.log("=======================学生的详细信息==================");
        console.log(res.data.data);
        //  查看是否有默认头像
        let face = res.data.data[0].face;
        // 将学生信息放到缓冲中
        wx.setStorageSync('student_Info', res.data.data[0]);
        if (face == "") {
          // 获取微信信息
          that.getUserInfo(function (user) {
            // 得到微信的头像
            var face = user.avatarUrl;
            res.data.data[0].face = face;
            // 下载微信默认头像
            that.loadImg(face, 0);
            // 将学生信息放到缓冲中
            wx.setStorageSync('student_Info', res.data.data[0])
          })
        }
        typeof cb == "function" && cb(res.data.data[0])
      } else {
        console.log("================获取学生信息失败===============");
        let msg = res.data.msg;
        // 清空信息，让其重新登录
        wx.removeStorageSync("user_Info");
        wx.removeStorageSync("student_Info");
        wx.removeStorageSync("session_id");
        that.showErrorModal(msg, "出错了", function () {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        })
      }
    })
  },
  // 正则截取地址
  regularAddress: function (address, type) {
    let substr = address.match(/(\S*)(?=省)/);
    let substr1 = address.match(/省(\S*)市/);
    // let substr2 = address.match(/(\S*)(?=市)/);
    // let substr3 = address.match(/(\S*)(?=县)/);
    let substr4 = address.match(/市(\S*)县/);
    let substr5 = address.match(/市(\S*)区/);
    let provice = substr ? substr[1] : address;
    let city = substr1 ? substr1[1] : "";
    let county = substr4 ? substr4[1] + "县" : '';
    let area = substr5 ? substr5[1] + "区" : '';
    if (city == "") {
      var newAddress = address;
    }
    // type == 1 市加县或区
    if (type == 1) {
      var newAddress = city + area + county;
    }
    else
      // 默认省+市+县或区
      var newAddress = provice + city + area + county;
    return newAddress;
  },
  // 上传头像地址
  loadImg: function (face, role) {
    let md5 = require("/utils/md5.min.js");
    var studentNum = this.studentNum;
    var data = {
      studentNum: studentNum,
      face: face,
    };
    var url = '/student/stuUpdate';
    let that = this;
    that.putRequest(url, data, function (res) {
      console.log(res)
      let status = res.data.status;
      if (status != 1) {
        let msg = res.data.meg;
        that.showErrorModal(msg)
      }
    })
  },
  // 获取数据库中的图片，并将其添加到缓冲中
  getImage: function (name, format, cb) {
    let that = this;
    let image = wx.getStorageSync(name);
    if (image) {
      console.log("=======================缓冲中含有图片地址======================")
      // 判断缓冲区中对应的图片是否还在
      wx.getImageInfo({
        src: image,
        success: function (res) {
          console.log("============缓冲中图片存在============");
          typeof cb == "function" && cb(image);
        },
        fail: function (res) {
          console.log("========缓冲中图片不存在==========");
          that.downImg(name, format, cb);
        }
      })
    } else {
      console.log("=======================缓冲中没有图片地址======================")
      that.downImg(name, format, cb);
    }
  },
  // 下载图片
  downImg: function (name, format, cb) {
    wx.downloadFile({
      url: "https://api.dysceapp.com/znyx/Public/image/" + name + format,
      type: 'image',
      success: function (res) {
        let tempFilePath = res.tempFilePath;
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            console.log("=================文件保存地址======================")
            let savedFilePath = res.savedFilePath;
            console.log(savedFilePath);
            // 将文件的保存地址保存到本地缓存中，调用的时候从这里根据地址调用图片
            wx.setStorageSync(name, savedFilePath);
            typeof cb == "function" && cb(savedFilePath);
          },
          fail: function (res) {
            console.log("============下载图片失败===========");
            console.log("=============删除图片==============");
            wx.getSavedFileList({
              success: function (res) {
                console.log(res)
                for (let i = 0; i < res.fileList.length; i++) {
                  wx.removeSavedFile({
                    filePath: res.fileList[i].filePath,
                    complete: function (res) {
                      console.log(res);
                      console.log("删除成功")
                      if (i == res.fileList.length - 1) {
                        console.log("开始下载新的")
                        that.downImg(name, format, cb)
                      }
                    }
                  })
                }
              }
            })
          },
          complete: function (res) {
            // complete
            console.log(res)
          }
        })

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  // 学生更新usecar
  updateUsecar: function (usecar, cb) {
    let studentNum = this.studentNum;
    let that = this;
    let data = {
      studentNum: studentNum,
      usecar: usecar
    };
    this.putRequest('/student/stuUpdate', data, function (res) {
      let status = res.data.status;
      if (status == 1) {
        // 将结果更新到缓冲中
        let student = wx.getStorageSync("student_Info");
        student.usecar = usecar;
        wx.setStorageSync('student_Info', student);
        typeof cb == "function" && cb(res);
      } else {
        let msg = res.data.msg;
        that.showErrorModal(msg)
      }
    })
  },
  // 发get请求
  getRequest: function (url, data, success) {
    let session_id = wx.getStorageSync('session_id');
    if (session_id) {
      data.session_id = session_id;
    }
    wx.request({
      url: this._server + url,
      data: data,
      method: 'GET',
      success: success,
      fail: function (res) {
        wx.hideToast();
        let msg = res.data.msg;
        app.showErrorModal(msg, "出错了");
      },
      complete: function (res) {

      }
    })
  },
  // 发post请求
  postRequest: function (url, data, success) {
    if (url == '/student/stuLogin') {
      console.log("============登陆接口================")
    } else {
      let session_id = wx.getStorageSync('session_id');
      if (session_id) {
        data.session_id = session_id;
      }
    }
    wx.request({
      url: this._server + url,
      data: data,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: success,
      fail: function (res) {
        wx.hideToast();
        let msg = res.data.msg;
        app.showErrorModal(msg, "出错了");
      },
      complete: function (res) {

      }
    })
  },
  // 发put请求
  putRequest: function (url, data, success) {
    let session_id = wx.getStorageSync('session_id');
    if (session_id) {
      data.session_id = session_id;
    }
    wx.request({
      url: this._server + url,
      data: data,
      method: 'PUT',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: success,
      fail: function (res) {
        wx.hideToast();
        let msg = res.data.msg;
        app.showErrorModal(msg, "出错了");
      },
      complete: function (res) {

      }
    })
  },
  // 检查手机号是否正确
  judgePhoneNum: function (num) {
    if ((/^1[34578]\d{9}$/.test(num))) {
      return true;
    } else {
      return false;
    }
  },
  // 禁止输入中文字符
  judgeChinese: function (num) {
    var wechat = "";
    for (let i = 0; i < num.length; i++) {
      if (num.charCodeAt(i) > 0 && num.charCodeAt(i) < 255) {
        wechat += num.charAt(i)
      }
    }
    return wechat;

  },
  // 验证电子邮箱
  judgeEmail: function (email) {
    let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (myreg.test(email)) {
      return true;
    } else {
      return false;
    }
  },
  // 删除数组中指定元素
  removeArrayValue: function (array, value) {
    if (typeof value == "object") {
      var value = JSON.stringify(value);
      for (let i = 0; i < array.length; i++) {
        let arrayValue = JSON.stringify(array[i]);
        if (arrayValue == value) {
          array.splice(i, 1);
        }
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        if (array[i] == value) {
          array.splice(i, 1);
        }
      }
    }

    return array;
  },
  // 将性格标签转化为数组
  changeCharacter: function (tag) {
    let array = tag.split(",");
    let character = []
    for (let i = 0; i < array.length - 1; i += 3) {
      character.push({
        name: array[i],
        swiperIndex: array[i + 1],
        characterIndex: array[i + 2]
      });

    }
    return character;
  }
})