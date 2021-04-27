// pages/oldAndNew/myNewlist.js
var config = require("../../utils/config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newUserList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取与用户绑定关系的新客户
    config.httpGet(app.getUrl(app.globalData.getMemberOldNewInfo),{
      openId: app.globalData.openId
    },function(newList){
      console.log(newList.data)
      that.setData({
        newUserList: newList.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})