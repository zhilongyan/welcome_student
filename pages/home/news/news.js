let app = getApp();
let _server = app._server;
Page({
  data:{
    message:{}
  },
  onLoad:function(options){
    let id = options.id;
    let that = this;
    let data = {
      id:id
    }
    app.getRequest('/notice/noticeSelect',data,function(res){
      let status = res.data.status;
      if(status == 1){
          let message = res.data.data[0];
         let time = message.time;
         let newTime = new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ')
         console.log(newTime)
         message.time = newTime;
         that.setData({message:message})
      }else{
        let msg = res.data.msg;
        app.showErrorModal(msg);
      }
    })
  },

})