// pages/userdatum/userdatum.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changePwd: false,
    mobile: '',
    mobiles:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var userInfo = wx.getStorageSync("userInfo");
    var tel = userInfo.CellPhone;
    this.setData({
      changePwd: (tel && tel.length > 0),
      mobile: tel,
      mobiles: tel.substr(0, 3) + "****" + tel.substr(7)
    });
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
  bindUserTap: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  bindUserTaps: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
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