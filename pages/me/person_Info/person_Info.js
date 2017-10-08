var app = getApp();
Page({
  data: {
    info: {},
    info_PS: {}
  },
  onLoad: function (options) {
  },
  onShow: function (options) {
    let student = wx.getStorageSync('student_Info');
    let tag = app.changeCharacter(student.tag);
    let infopub = student.infopub/1;
    this.setData({ info: student, tag: tag, infopub: infopub});

  },
  // 编辑
  edit: function () {
    wx.navigateTo({
      url: '../../login/login_code_Info_PS?from=wode',
    })
  },
  // 改绑
  modify : function(){
    wx.navigateTo({
      url: '../changePhone/changePhone',
    })
  },
  // 信息是否公开
  switchChange : function(e){
    let status = e.detail.value;
    let infopub = '0';
    if(status){
      console.log("============公开信息===============");
      infopub = '1';
    }else{
      console.log("==============不公开信息=================")
    }
    let student = wx.getStorageSync('student_Info');
    var data = {
      studentNum: student.studentnum,
      infopub: infopub
    }
    app.putRequest('/student/stuUpdate', data, function (res) {
      wx.hideToast()
      let status = res.data.status;
      if (status == 1) {
        student.infopub = infopub;
        wx.setStorageSync('student_Info', student)
      }
      else {
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  }
})
