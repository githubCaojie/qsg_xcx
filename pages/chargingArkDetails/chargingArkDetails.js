// pages/chargingArkDetails/chargingArkDetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('qsgUserInfo'),
    arkDetails: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.request({
      url: app.getUrl('Cabinet/GetCabinetDetail'),
      // url: 'http://10.13.17.235:8067/smallprogapi/Cabinet/GetCabinetDetail',
      data: {
        devId: options.devid,
        token: _this.data.userInfo.LvToken
      },
      success(res) {
        console.log(res)
        _this.setData({
          arkDetails: res.data.data
        })
        console.log(_this.data.arkDetails)
      }
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