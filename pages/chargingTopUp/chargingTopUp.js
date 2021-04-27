// pages/chargingTopUp/chargingTopUp.js
var config = require("../../utils/config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    RechargeNum: '',
    moneyHide: true,
    onInputMoney: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app.getOpenId(function (openid) {
      _this.setData({
        openId: openid
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  changeIsUseCapitalAmount () {
    this.setData({
      moneyHide: false,
    })
  },
  onInputMoney(e) {
    this.setData({
      onInputMoney: e.detail.value
    })
  },
  hideMoney () {
      this.setData({
        moneyHide: true,
      });
  },
  confirmMoney() {
    let _this = this,
        money = _this.data.onInputMoney;
    if(!money) return app.showErrorModal("请输入充值金额");
    if(money>99999) return app.showErrorModal("充值金额最大不能超过99999");
    else {
      _this.setData({
        RechargeNum: money,
        moneyHide: true,
      })
    }
  },
  Recharge(e) {
    let _this = this;
    let money = e.currentTarget.dataset.num;
    _this.setData({
      RechargeNum: money
    })
  },
  rechargeOkBtn() {
    let _this = this,
        openId = _this.data.openId,
        money = _this.data.RechargeNum;
        console.log(openId)
        console.log(money)
        if(!money) return app.showErrorModal("请输入充值金额");
        new Promise((resolve, reject) => {
          config.httpPost(app.getUrl('MemberCapital/PostCharge'), {
            openId: openId,
            typeId: 'Himall.Plugin.Payment.WeiXinPay_SmallProg',
            amount: money,
          },function (res) {
            if (res.success) {
              resolve(res.data)
            } else {
              reject(res.msg)
            }
          })
        }).then(r => {
          wx.requestPayment({
            timeStamp: r.timeStamp,
            nonceStr: r.nonceStr,
            package: 'prepay_id=' + r.prepayId,
            signType: 'MD5',
            paySign: r.sign,
            success: function (res) {
              _this.setData({
                  moneyHide: true
                });
                wx.showToast({
                    title: '充值成功'
                });
            },
            fail: function (res) {
            }
          });
        })
        .catch(r => {
          app.showErrorModal(r);
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