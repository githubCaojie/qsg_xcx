// pages/oldAndNew/getNewUser.js
var config = require("../../utils/config.js");
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    oldUserId: '',
    oldUserName: '',
    userPhone: '',
    openId: '',
    userInfo: '',
    isNewBind: false,
    isLogin: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      oldUserId: options.olduserid,
      oldUserName: options.oldusername,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadData()
  },
  
  loadData: function() {
    var that = this;
    app.getOpenId(function(openid) {
        if (openid) {
            config.httpGet(app.getUrl('UserCenter/GetUser'), {
                openId: openid,
                userkey: ""
            }, function(res) {
                if (res.success) {
                    that.setData({
                      isLogin: true,
                      userInfo: res.data,
                      openid: openid
                    });
                    wx.request({
                      url: `${app.getUrl(app.globalData.GetMemberOldNewInfoByNewMemberId)}?openId=${that.data.openid}`,
                      header: {},
                      method: 'get',
                      dataType: 'json',
                      responseType: 'text',
                      success: function(res){
                        let phone = that.data.userInfo.CellPhone
                        if(!phone){
                          that.setData({
                            isBindPhoneBtn: false
                          })
                        }else{
                          that.setData({
                            isBindPhoneBtn: true
                          })
                        }
                        if(res.data.data == null){
                          that.setData({
                            isNewBind: false
                          })
                        }else{
                          that.setData({
                            isNewBind: true
                          })
                        }
                      }
                    })
                    console.log(that.data.userInfo)
                }
            });
        }
    }, "getNewUser");
},
  // 跳转绑定手机号码
  goBindMobile() {
    wx.showModal({
      title: '提示',
      confirmText: '前往绑定',
      content: '为提供更优质的服务,需绑定您的手机',
      success (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../usermobile/usermobile'
          })
        }
      }
    })
  },
  bindOldUser() {
    let that = this;
    
    wx.request({
      url: `${app.getUrl(app.globalData.SaveMemberOldNewInfoByStatusCode)}?openId=${that.data.openid}&oldMemberId=${that.data.oldUserId}&isNewMember=1`,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res){
        wx.showToast({
          title: res.data.data,
          icon: 'success',
          duration: 2000
        })
        wx.navigateToMiniProgram({
          appId: 'wx1426e2132ddfdb4f',
          path: '',
          extarData: {},
          envVersion: 'release',
          success(res) {
            // 打开成功
            console.log("小程序跳转成功");
          }
        })
      }
    })
  },
  // 换电
  bindingChange: function() {
    var that = this;
      wx.request({
        url: `${app.getUrl(app.globalData.SaveMemberOldNewInfoByStatusCode)}?openId=${that.data.openid}&oldMemberId=${that.data.oldUserId}&isNewMember=0`,
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res){
          wx.navigateToMiniProgram({
            appId: 'wx1426e2132ddfdb4f',
            path: '',
            extarData: {},
            envVersion: 'release',
            success(res) {
              // 打开成功
              console.log("小程序跳转成功");
            }
          })
        }
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
  onShareAppMessage: function () {

  }
})