// pages/oldAndNew/oldAndNew.js
var config = require("../../utils/config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:'',
    userInfo: '',
    userCode:'',
    isBindPhoneBtn: false,
    isShowCode: false,
    isPermissions: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.load()
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let phone = wx.getStorageSync("userInfo").CellPhone
    if(!phone){
      this.setData({
        isBindPhoneBtn: false
      })
    }else{
      this.setData({
        isBindPhoneBtn: true
      })
    }
  },
  load() {
    var that = this;
    app.getOpenId(function (openid) {
      that.setData({
        openId: openid,
        userInfo: wx.getStorageSync("userInfo"),
        isPermissions: wx.getStorageSync("userInfo").IsStationMaster
      })
    })
  },
  // 跳转绑定手机号码
  goBindMobile() {
    wx.showModal({
      title: '提示',
      confirmText: '前往绑定',
      content: '为维护您的推广关系，需绑定手机号码',
      success (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../usermobile/usermobile'
          })
        }
      }
    })
  },
  // 跳转至我邀请的用户列表 2020.12.2
  goMynewlistClick() {
    wx.navigateTo({
        url: 'myNewlist'
    })
  },
  // 获取推广二维码base64
  getUserCodeBase64(codeRes) {
    let that = this;
    let phone = wx.getStorageSync("userInfo").CellPhone
    if(phone == ''){
       return wx.showModal({
        title: '提示',
        confirmText: '前往绑定',
        content: '为维护您的推广关系，需绑定手机号码',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../usermobile/usermobile'
            })
          }
        }
      })
    }else{
      wx.request({
        url: app.getUrl(app.globalData.GetWxAcode),
        data:{
          path: `/pages/oldAndNew/getNewUser?olduserid=${codeRes}&oldusername=${that.data.userInfo.Nick}`,
          width: 430
        },
        dataType: 'json',
        cache: false,
        success: function (res) {
          if(res.errMsg == 'request:ok'){
            that.setData({
              userCode: res.data.data.data
            })
          }
        }
      })
    }
  },
  // 显示与隐藏二维码 2020.12.2
  showCode(){
    let codeRes = this.data.userInfo.UserId
    this.getUserCodeBase64(codeRes)
    this.setData({
      isShowCode: true
    })
  },
  hideCode() {
    this.setData({
      isShowCode: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  onShareAppMessage: function (options) {
    var that = this,
      path;
    return {
      title: '来骑手港做骑手，解决您的配送烦恼',
      path: `/pages/oldAndNew/getNewUser?olduserid=${that.data.userInfo.UserId}&oldusername=${that.data.userInfo.Nick}`
    }
  }
})