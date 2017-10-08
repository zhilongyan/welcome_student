// pages/home/payment/paymentQuestion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  understand : function(){
    let user = wx.getStorageSync("user_Info");
    user.jfstatus = 1;
    wx.setStorageSync("user_Info", user);
    wx.redirectTo({
      url: 'payment',
    })
  }
})