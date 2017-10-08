// pages/addQuestion/addQuestion.js
let app = getApp();
let _server = app._server
Page({
  data: {},
  onLoad: function (options) {
  },
  submitQuestion: function (options) {
    let title = this.data.title;
    let message = this.data.message;
    if(title == undefined || message == undefined){
      return
    }
    // 替换空格
    title = title.replace(/(^\s*)|(\s*$)/g, "");
    let content = message.replace(/(^\s*)|(\s*$)/g, "");
    let student = wx.getStorageSync('student_Info');
    let id = student.studentnum;
    let name = student.name;
    let from_face = student.face;
    if (title == "") {
      app.showErrorModal("标题不可为空！")
      return;
    }
    if (content == "") {
      app.showErrorModal("内容不可为空！")
      return;
    }
    let data = {
      from_id: id,
      from_name: name,
      title: title,
      content: content,
      from_face: from_face,
      role: 7
    };
    app.postRequest('/question/questionAdd', data, function (res) {
      console.log(res)
      let status = res.data.status;
      console.log(status)
      if (status == 1) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 10000
        })
        setTimeout(function () {
          wx.hideToast();
          wx.switchTab({
            url: '../forum/forum'
          })
        }, 2000)
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  },
  title : function(e){
    let title = e.detail.value;
    this.setData({title:title})
  },
  message: function (e) {
    let message = e.detail.value;
    this.setData({ message: message })
  }
})