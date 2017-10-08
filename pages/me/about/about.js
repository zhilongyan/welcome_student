// pages/me/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  introduction : function(){
    wx.navigateTo({
      url: '../introduction/introduction',
    })
  },
  contact : function(){
    wx.navigateTo({
      url: '../contact/contact',
    })
  }
})