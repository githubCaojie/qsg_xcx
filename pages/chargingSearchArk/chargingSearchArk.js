// pages/chargingSearchArk/chargingSearchArk.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    LvUserInfo: wx.getStorageSync('qsgUserInfo'),
    markers: '',
    lat: '',
    lon: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      lat: options.lat,
      lon: options.lon,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建 map 上下文 MapContext 对象。
    this.mapCtx = wx.createMapContext('map')
    this.getUserPosition()
  },

  // 事件
  // 搜索
  onConfirmSearch(e) {
    let _this = this;
    new Promise((resolve, reject) => {
      wx.request({
        url: app.getUrl('Cabinet/GetCabinetListByName'),
        data: {
          lat: _this.data.lat,
          lon: _this.data.lon, 
          distance: 1000,
          page: 1,
          size: 1000,
          token: _this.data.LvUserInfo.LvToken,
          name: e.detail.value
        },
        success(res) {
          if(res.errMsg = "request:ok") {
            resolve(res.data.data.list)
          }
        }
      })
    }).then(res => {
      if(res=='') {
        return  wx.showModal({ title: '提示',showCancel: false,content: '未找到该充电柜'})
      }else {
        _this.setData({
          markers: res
        })
      }
    }).catch(res => {

    })
  },

  // 首次进入页面获取当前地图中心的经纬度并加载定位范围内的机柜信息
  getUserPosition() {
    let _this = this;
    new Promise((resolve, reject) => {
      wx.request({
        url: app.getUrl('Cabinet/GetCabinetListByName'),
        data: {
          lat: _this.data.lat,
          lon: _this.data.lon, 
          distance: 1000,
          page: 1,
          size: 1000,
          token: _this.data.LvUserInfo.LvToken,
          name: ''
        },
        success(res) {
          if(res.errMsg = "request:ok") {
            resolve(res.data.data.list)
          }
        }
      })
    }).then(res => {
      _this.setData({
        markers: res
      })
      console.log(this.data.markers)
    }).catch(res => {

    })
  },

  arkDetailsClick(e) {
    let devid = e.currentTarget.dataset.devid
    wx.navigateTo({
      url: '../chargingArkDetails/chargingArkDetails?devid=' + devid,
    })
  },

  navigationClick(e) {
    wx.openLocation({
      latitude: e.currentTarget.dataset.lat,
      longitude: e.currentTarget.dataset.lon,
      scale: 18
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