let app = getApp();
var wxbarcode = require('../../../js/index.js');

Page({

  data: {

  },

  onLoad: function () {
    this.setData({code : app.studentNum})
    wxbarcode.barcode('barcode', app.studentNum, 680, 200);
    wxbarcode.qrcode('qrcode', app.studentNum, 420, 420);
  }
})