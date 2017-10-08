// pages/home/information/information.js
let app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    let id = options.id;
    let that = this;
    app.getRequest("/news/newsSelect", { id: id }, function (res) {
      let status = res.data.status;
      if (status == 1) {
        let data = res.data.data[0];
        let time = data.time;
        let newTime = new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
        let title = data.title;
        var content = data.content;
        let contentArr = [];
        let imgArr = data.imgstring.split(",");
        for (let i = 0; i < imgArr.length; i++) {
          let index = content.indexOf("[农大新闻图片IC]");
          if (index == -1) {
            var newContent = content;
          } else {
            var newContent = content.substring(0, index);
          }
          let object = {
            content: newContent,
            img: imgArr[i],
          };
          contentArr.push(object);
          content = content.substring(index + 10);
        }
        if (content) {
          let object = {
            content: content,
          };
          contentArr.push(object);
        }
        that.setData({ content: contentArr, time: newTime, title: title })
      } else {
        let msg = res.dat.msg;
        app.showErrorModal(msg)
      }
    })
  },
})