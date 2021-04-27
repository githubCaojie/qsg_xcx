// pages/chargingArkList/chargingArkList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    latitude: '',
    longitude: '',
    arkListArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //创建 map 上下文 MapContext 对象。
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取QSG用户信息并赋值到userInfo
    this.setData({
      userInfo: wx.getStorageSync('qsgUserInfo')
    })
    //创建 map 上下文 MapContext 对象。
    this.mapCtx = wx.createMapContext('map')
    this.getUserPosition()
  },

  // 事件
  // 首次进入页面获取当前地图中心的经纬度并加载定位范围内的机柜信息
  getUserPosition() {
    let _this = this;
    new Promise(function(resolve, reject) {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          if(res.errMsg == "getLocation:ok"){
            _this.setData({
              latitude: res.latitude,
              longitude: res.longitude,
            })
            resolve('数据处理完成')
          }
        }
      })
    }).then(
      (res) => {
        wx.request({
          url: app.getUrl('Cabinet/GetCabinetListByName'),
          data: {
            lat: _this.data.latitude,
            lon: _this.data.longitude, 
            distance: 1000,
            page: 1,
            size: 1000,
            token: _this.data.userInfo.LvToken
          },
          success(res) {
            _this.setData({
              arkListArray: res.data.data.list
            })
            console.log(_this.data.arkListArray)
          }
        })
      },  // 成功
      (err) => {console.log(err)} // 失败
    )
  },
  
  // 一键导航
  navigationClick(e) {
    wx.openLocation({
      latitude: e.currentTarget.dataset.lat,
      longitude: e.currentTarget.dataset.lon,
      scale: 18
    })
  },

  // 查看柜机详情
  arkDetailsClick(e) {
    let devid = e.currentTarget.dataset.devid
    wx.navigateTo({
      url: '../chargingArkDetails/chargingArkDetails?devid=' + devid,
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