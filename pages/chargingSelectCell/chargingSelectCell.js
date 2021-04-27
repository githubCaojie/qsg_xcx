// pages/chargingSelectCell/chargingSelectCell.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LvwoBilltemplateInfo: '',
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
    let _this = this;
    wx.request({
      url: app.getUrl(app.globalData.GetLvwoBilltemplateInfo),
      success(res) {
        _this.setData({
          LvwoBilltemplateInfo: res.data.data
        })
      }
    })
  },
  selectCellClick() {

  },
  goRenCreateClick(e) {
    console.log(e.currentTarget.dataset.ark)
    let ark = e.currentTarget.dataset.ark
    wx.navigateTo({
      url: '../chargingRenCreate/chargingRenCreate?RentAmt=' + ark.RentAmt + '&BatteryBrand=' + ark.BatteryBrand + '&BatteryModel=' + ark.BatteryModel + '&DepositAmt=' + ark.DepositAmt + '&BillNum=' + ark.BillNum + '&BillUnit=' + ark.BillUnit,
    })
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