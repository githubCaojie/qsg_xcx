// pages/chargingRenCreate/chargingRenCreate.js
var config = require("../../utils/config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RentAmt: '',
    BatteryBrand: '',
    BatteryModel: '',
    DepositAmt: '',
    BillNum: '',
    BillUnit: '',
    passwordHide: true,
    pwd: '', //支付密码
    againPwd: '', //确认支付密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      RentAmt: options.RentAmt,
      BatteryBrand: options.BatteryBrand,
      BatteryModel: options.BatteryModel,
      DepositAmt: options.DepositAmt,
      BillNum: options.BillNum,
      BillUnit: options.BillUnit
    })
    _this.getHasSetPayPwd();
  },
  getHasSetPayPwd () {
    var that = this;
    app.getOpenId(function (openid) {
        config.httpGet(app.getUrl('Payment/GetHasSetPayPwd'), { openId: openid }, function (res) {
            if (res.success) {
                that.setData({
                    hasSetPayPwd: true
                })
            }
        });
    });
},
  cellPayClick () {
    let _this = this;
    _this.setData({
      passwordHide: false
    })
    
  },
  hidePassword () {
    this.setData({
        passwordHide: true,
    });
  },
  confirmPwd () {
    let _this = this;
    var pwd = this.data.pwd, againPwd = this.data.againPwd, that = this;
    if (_this.data.hasSetPayPwd) {
      if (pwd == "") {
        app.showErrorModal("请输入密码");
        return;
      }
      app.getOpenId(function (openId) {
        config.httpPost(app.getUrl('MemberCapital/LvwoLeasePostCharge'),{
          openId: openId,
          typeId: 'Himall.Plugin.Payment.WeiXinPay_SmallProg',
          amount: Number(_this.data.RentAmt) + Number(_this.data.DepositAmt),
          pwd: pwd
        }, function(res) {
          console.log(res)
          if(res.success) {
            var r = res.data;
            wx.requestPayment({
              timeStamp: r.timeStamp,
              nonceStr: r.nonceStr,
              package: 'prepay_id=' + r.prepayId,
              signType: 'MD5',
              paySign: r.sign,
              success(res) {
                console.log(res)
                if(res.errMsg == 'requestPayment:ok') {
                  wx.showModal({
                    title: '提示',
                    content: "支付成功！",
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.redirectTo({
                          url: '../chargingHome/chargingHome'
                        })
                      }
                    }
                  })
                }
              }
            })
          }else {
            app.showErrorModal(res.msg);
            _this.setData({
              passwordHide: true
            })
          }
        })
      })
    } else {
      if (pwd == "") {
        app.showErrorModal("请输入密码");
        return;
      }
      if (againPwd == "") {
        app.showErrorModal("请确认密码");
        return;
      }
      if (pwd != againPwd) {
        app.showErrorModal("两次密码输入不一致");
        return;
      }
      app.getOpenId(function (openid) {
          config.httpPost(app.getUrl('Payment/PostSetPayPwd'), { openId: openid, pwd: pwd }, function (res) {
              if (res.success) {
                  that.setData({
                      passwordHide: true,
                      confirmedPwd: true,
                      hasSetPayPwd: true
                  });
              } else {
                  app.showErrorModal("设置密码失败");
              }
          });
      });
    }
  },
  bindChangePassword (e) {
    wx.navigateTo({
        url: '../bindMobilePhone/bindMobilePhone',
    });
  },
  onInputPwd (e) {
    this.setData({
        pwd: e.detail.value
    })
  },
  onInputAgainPwd (e) {
    this.setData({
        againPwd: e.detail.value
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