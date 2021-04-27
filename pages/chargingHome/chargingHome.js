// pages/chargingHone/chargingHome.js
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    LvUserInfo: wx.getStorageSync('qsgUserInfo'),
    wxUserInfo: app.globalData.wxUserInfo,
    // 当前位置
    userPosition: {},
    latitude: '',
    longitude: '',
    // 标记arrAy
    markers: [],
    clickArk: {},
    isShowArkList: false,
  },
  // 事件
  // 首次进入页面获取当前地图中心的经纬度并加载定位范围内的机柜信息
  getUserPosition() {
    let _this = this;
    new Promise(function(resolve, reject) {
      _this.mapCtx.getCenterLocation({
        success: function(res){
          if(res.errMsg == "getMapCenterLocation:ok"){
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
            distance: 100000,
            page: 1,
            size: 1000,
            token: _this.data.LvUserInfo.LvToken,
            name: ''
          },
          success(res) {
            _this.setData({
              markers: res.data.data.list
            })
          }
        })
      },  // 成功
      (err) => {console.log(err)} // 失败
    )
  },
  // 视野变化，滑动地图
  regionchange(e) {
    var _this = this;
    _this.setData({
      isShowArkList: false
    })
  },
  // 点击地图
  mapBindtap(e) {
    var _this = this;
    _this.setData({
      isShowArkList: false
    })
  },
  // 点击标记
  arkMarkertap(e) {
    let _this = this;
    let id = e.markerId;
    let arkList = _this.data.markers;
    for(let i of arkList) {
      if( i.id === id ){
        console.log(i)
        _this.setData({
          clickArk: i,
          isShowArkList: true
        })
      }
    }
  },
  // 点击控件
  controltap(e) {
    console.log('controltap' + e)
  },
  // 重置位置
  resetClick() {
    this.reset()
    this.setData({
      isShowArkList: false
    })
  },
  // 初始化地图
  reset() {
    var _this = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  // 扫码
  scanningClick() {
    let _this = this;
    // 获取当前日期
    let d = new Date();
    let thisDate = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    if(_this.data.LvUserInfo.LvTokenDate > thisDate) {
      return wx.showModal({
        title: '提示',
        content: '登录token已过期，是否请重新登录',
        success (res) {
          if (res.confirm) {
            wx.removeStorageSync('mallAppletOpenId');
            wx.removeStorageSync("userInfo");
            wx.removeStorageSync("distributorId");
            wx.removeStorageSync("qsgUserInfo");
            app.globalData.wxUserInfo = null;
            app.globalData.openId = "";
            wx.navigateTo({
              url: '../login/login',
            })
          }
        }
      })
    }
    app.getOpenId(function (openId) {
      // 获取是否存在有效租赁电池订单
      let GetChargeDetailInfo = new Promise((resolve, reject) => {
        wx.request({
          url: app.getUrl('MemberCapital/GetChargeDetailInfoByLease'),
          data: {openId},
          success(res) {
            if(res.errMsg == "request:ok"){
              resolve(res.data.data);
            }else {
              reject(res.data.msg);
            }
          }
        })
      })
      // 获取是否存在有效租赁电池订单 => 成功
      GetChargeDetailInfo.then(res => {
        if(res == null) {
          wx.showModal({
            title: '提示',
            content: '还未租赁电池',
            success (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../chargingSelectCell/chargingSelectCell'
                })
              }
            }
          })
        }else {
          // 获取用户预付金额（即充值的金额
          let BatteryTimes = res.BatteryTimes;
          let GetCapital = new Promise((resolve, reject) => {
            wx.request({
              url: app.getUrl('MemberCapital/GetCapital'),
              data: {
                openId: openId
              },
              success(res) {
                if(res.errMsg == "request:ok") {
                  resolve({capitalArray:res.data.data,BatteryNum:BatteryTimes});
                }else {
                  reject(res);
                }
              }
            })
          })
          // 获取用户预付金额（即充值的金额）=> 成功
          GetCapital.then(res => {
            if(res.capitalArray.Balance <= 0) {
              wx.showModal({
                title: '提示',
                content: '可用余额不足，请及时充值',
                success (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../chargingTopUp/chargingTopUp'
                    })
                  }
                }
              })
            }else{
              // 设备控制
              wx.scanCode({
                onlyFromCamera: true,
                success (res) {
                  let mygType = '';
                  if(res.BatteryNum = 0) {mygType = '11'}else {mygType = '01'}
                  let myDevId = res.result;
                  let control =  new Promise((resolve, reject) => {
                    wx.showLoading({
                      title: '正在开柜，请稍后',
                    })
                    wx.request({
                      url: app.getUrl('Cabinet/PostCabinetControl'),
                      method: 'post',
                      data: {
                        access_token: _this.data.LvUserInfo.LvToken,
                        mygId: mygType,
                        devId: myDevId,
                      },
                      success(res) {
                        if(res.errMsg == "request:ok"){
                          let data = {
                            arr: res.data.data,
                            mygId: mygType,
                            devId: myDevId
                          }
                          resolve(data)
                        }else {
                          reject()
                        }
                      }
                    })
                  })
                  // 设备控制 => 成功
                  control.then(res => {
                    console.log(res)
                    wx.hideLoading()
                    if(res.arr.result == 0 || res.arr.result == null ) return  wx.showModal({ title: '提示',showCancel: false,content: '未知错误，请重试'})
                    if(res.arr.result == 1 || res.arr.result == 2) {
                      wx.showModal({ title: '提示',content: '取电成功，请及时换电'})
                      wx.request({
                        url: app.getUrl("Cabinet/GetBatteryId"),
                        data: {
                          token: _this.data.LvUserInfo.LvToken,
                          devId: res.devId,
                          type: res.mygId = "11" ? 1 : 2
                        },
                        success(res) {
                          console.log(res)
                        }
                      })
                    }
                    if(res.arr.result == 3) return  wx.showModal({ title: '提示',showCancel: false,content: '前一个流程还未结束'})
                    if(res.arr.result == 4) return  wx.showModal({ title: '提示',showCancel: false,content: '当前没有空柜门'})
                    if(res.arr.result == 5) return  wx.showModal({ title: '提示',showCancel: false,content: '当前没有满电电池'})
                    if(res.arr.result == 6) return  wx.showModal({ title: '提示',showCancel: false,content: '当前没有对应电压等级电池'})
                  })
                }
              })
            }
          })
        }
      })
      // 获取是否存在有效租赁电池订单失败
      GetChargeDetailInfo.catch(res => {
        wx.showModal({
          title: '提示',
          content: res,
        })
      })
    })
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
  // 搜索机柜
  searchArkClick() {
    let _this = this;
    wx.navigateTo({
      url: '../chargingSearchArk/chargingSearchArk?lat='+ _this.data.latitude + '&lon=' + _this.data.longitude,
    })
  },
  // 查看换电柜列表
  getArklistClick() {
    wx.navigateTo({
      url: '../chargingArkList/chargingArkList',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reset()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建 map 上下文 MapContext 对象。
    this.setData({
      wxUserInfo: app.globalData.wxUserInfo
    })
    this.mapCtx = wx.createMapContext('map')
    this.getUserPosition()
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