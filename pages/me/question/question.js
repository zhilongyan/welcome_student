// pages/me/reply/reply.js
let app = getApp();
let pageNum = 10;
Page({
  data: {
    message: [
    ],
    page: 1,
    downStatus: false,
    loadAllStatus: false,

    noMessage: false,
    studentNum: ''
  },
  onLoad: function (options) {
    // 将学号放到数据层中，以便后面调用
    let student = wx.getStorageSync('user_Info');
    let studentNum = student.studentNum;
    console.log("=============学号===================")
    console.log(studentNum);
    this.setData({ studentNum: studentNum })
    this.getMes();

  },
  // 获取我的提问的数据
  getMes: function () {
    // 导航条加载中样式,只有加载第一页的时候才会出现
    if (page == 1) {
      wx.showNavigationBarLoading()
    }
    // 取到学号
    let studentNum = this.data.studentNum;
    // 取到页码
    let page = this.data.page;
    let that = this;
    let data = {
      from_id: studentNum,
      parent_id: 0,
      page: page,
      pageNum: pageNum
    };
    app.getRequest("/question/questionSelect", data, function (res) {
      wx.stopPullDownRefresh();
      let status = res.data.status;
      if (status == 1) {
        console.log("=============第" + page + "页的内容=============");
        console.log(res.data.data);
        let count = res.data.count;
        if (count == 0) {
          console.log("=============没有查询到数据==============");
          that.setData({
            downStatus: false,
            loadAllStatus: false,
            noMessage: true,
            message: []
          });
          return;
        }
        // 获得当前页面的内容
            let mes = res.data.data;
        for (let i = 0; i < mes.length; i++) {
          let time = mes[i].time;
          let newTime = new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
          mes[i].time = newTime;
        }
        // 当前页面不是第一页,需要将前面的内容和现在的内容连接在一起
        if (page != 1) {
          var oldMes = that.data.message;
          var newMes = oldMes.concat(mes)
        } else {
          var newMes = mes;
        }
        // 获得总页数
        let allPage = Math.ceil(count / pageNum);
        // 下一页的页码
        let nextPage = page + 1;
        // 下一页的页码大于总页数，不继续加页码了
        if (nextPage > allPage) {
          var newPage = page;
          // 是否显示下拉加载
          var loadAllStatus = true;
          var downStatus = false;
        }
        else {
          var newPage = nextPage;
          var downStatus = true;
          var loadAllStatus = false;
        }
        that.setData({
          message: newMes,
          page: newPage,
          downStatus: downStatus,
          loadAllStatus: loadAllStatus,
          noMessage: false
        })
      } else {
        let msg = res.data.msg;
        app.showErrorModal(msg)
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function (e) {
    this.setData({  page: 1 });
    this.getMes();
  },
  //上拉加载
  onReachBottom: function (e) {
    //获取现在是否已全部加载完毕
    let loadAllStatus = this.data.loadAllStatus;
    //如果全部加载完毕，则不执行下拉加载
    if (loadAllStatus == true) return;
    //显示加载中
    this.setData({ downStatus: false });
    this.getMes();
  },
  // 点击问题，区别长按和短按
  handleQuestion: function (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    console.log(e)
    console.log(index)
    let that = this;
    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);
    //如果按下时间大于350为长按,长按删除问题
    if (touchTime > 350) {
      wx.showActionSheet({
        itemList: ['删除'],
        success: function (res) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0) {
            let data = {
              question_id: id
            }
            app.postRequest('/question/questionDel', data, function (res) {
              let status = res.data.status;
              if (status == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                });
                let question = that.data.message;
                question.splice(index, 1);
                that.setData({ message: question })
              } else {
                let msg = res.data.msg;
                app.showErrorModal(msg)
              }
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
    //  短按是跳转
    else {
      console.log("跳转");
      wx.navigateTo({
        url: '/pages/forum/forumMessage/forumMessage?id=' + id
      })
    }
  },
  //按下事件开始
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
  },
})