// pages/login/login.js
var config = require("../../utils/config.js");
var app = getApp();
var islogin = true;
var distributorId;

Page({
    data: {
        disabled: true,
        userName: "",
        password: "",
        hidePwd: true,
        isauthed: true,
        imgCodeData: {},
        cellPhone: "",
        cellImgCode: "",
        cellPhoneCode: "",
        time: 0,
        isCodeSign: false
    },
    onLoad: function (options) {
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                } else {
                    that.setData({
                        isauthed: false
                    })
                }
            }
        })
        that.loadImageCheckCode();
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    //图形验证码
    loadImageCheckCode: function () {
      var that = this;
      config.httpGet(app.getUrl(app.globalData.getImageCheckCode), {}, function (res) {
        if (res.success) {
          that.setData({
            imgCodeData: res.data
          });
        }
      });
    },
    bindUserNameInput: function (e) {
        this.setData({
            userName: e.detail.value
        })
    },
    bindPwdInput: function (e) {
        this.setData({
            password: e.detail.value
        })
        if (this.data.userName.length > 0 && this.data.password.length > 0) {
            this.setData({
                disabled: false
            })
        }
        else {
            this.setData({
                disabled: true
            })
        }
    },
    showPwdChange: function () {
        this.setData({
            hidePwd: !this.data.hidePwd
        })
    },
    bindGetUserInfo: function (e) {
        var type = e.currentTarget.dataset.type;
        if (type == 'byuser') {
            this.loginbyUser();
        } else {
            islogin = true;
            this.quickLogin();
        }
    },
    loginbyUser: function (e) {
        //账号登录
        const uname = this.data.userName;
        const pwd = this.data.password;
        if (pwd.length < 6) {
            app.showErrorModal("密码长度不能少于6位");
            return;
        }
        wx.showLoading({
            title: '正在登录',
            mask: true
        })
        app.getWxUserInfo(function (wxUserInfo) {
            wx.request({
                url: app.getUrl("login/getLoginByUserName"),
                data: {
                    openId: wxUserInfo.openId,
                    userName: uname,
                    password: pwd,
                    nickName: wxUserInfo.nikeName,
                    unionId: wxUserInfo.unionId,
                    encryptedData: wxUserInfo.encryptedData,
                    session_key: wxUserInfo.session_key,
                    iv: wxUserInfo.iv
                },
                success: function (result) {
                    result = result.data;
                    wx.hideLoading();
                    if (result.success) {
                        //app.setUserInfo(result.data);
                        app.setUserInfo(wxUserInfo);
                        app.getUserCenterInfo();
                        wx.navigateBack();
                    } else {
                        app.showErrorModal(result.msg);
                    }
                }
            })
        })
    },
    quickLogin: function (e) {
        //信任登录
        distributorId = wx.getStorageSync("distributorId");
        wx.showLoading({
            title: '登录中',
            mask: true,
        })
        app.getWxUserInfo(function (wxUserInfo) {
            var params = {
                openId: wxUserInfo.openId,
                nickName: wxUserInfo.nikeName,
                unionId: wxUserInfo.unionId,
                headImage: wxUserInfo.headImage,
                encryptedData: wxUserInfo.encryptedData,
                session_key: wxUserInfo.session_key,
                iv: wxUserInfo.iv
            };
            if (distributorId) {
                params.spreadId = distributorId;
            }

            wx.request({
                url: app.getUrl("Login/GetQuickLogin"),
                data: params,
                success: function (result) {
                    result = result.data;
                    wx.hideLoading();
                    if (result.success) {
                        app.globalData.IsStationMaster = result.data.IsStationMaster
                        app.globalData.CellPhone = result.data.CellPhone
                        // app.setUserInfo(result.data);
                        app.setUserInfo(wxUserInfo);
                        wx.navigateBack();
                        app.getUserCenterInfo();
                    }
                }
            })
        })
    },
    // 2020.09.11   ------验证码登录 
    codePhoneInput: function(e) {
        this.setData({
            cellPhone: e.detail.value
        })
    },
    codeImgCodeInput: function(e) {
        this.setData({
            cellImgCode: e.detail.value
        })
    },
    codePhoneCodeInput: function(e){
        this.setData({
            cellPhoneCode: e.detail.value
        })
    },
    codeLoginFormSubmit: function(e) {
        let that = this;
        let phone = that.data.cellPhone;
        let imgCode = that.data.cellImgCode;
        if(phone.length == 0 || imgCode.length == 0) {
            var msg = phone.length == 0 ? '请输入手机号码' : '请输入图形验证码';
            wx.showToast({
                title: msg,
                icon: 'none',
                image: '',
                mask: true,
            });
        }else{
            this.bindSendCheckCode(imgCode, true);
        }
    },
    cellLoginbyUser: function(e){
        const that = this;
        let phone = that.data.cellPhone;
        let imgCode = that.data.cellImgCode;
        let checkCode = that.data.cellPhoneCode;
        let msg = '手机号登录成功！';
        if(phone.length == 0 || imgCode.length == 0 || checkCode.length == 0) {
            msg = phone.length == 0 ? '请输入手机号码' : (imgCode.length == 0 ? '请输入图形验证码' : '请输入手机验证码');
        }else{
            app.getWxUserInfo(function (wxUserInfo) {
                that.verifyCheckCode(checkCode, function(certificate) {
                    config.httpPost(app.getUrl(app.globalData.LoginByCertificateOrRegist)+'?certificate='+encodeURIComponent(certificate)+'&openId='+wxUserInfo.openId+'&phone='+phone, {
                    }, function(res) {
                        if (!res.success) {
                            msg = res.msg;
                        }else{
                            console.log(res)
                            app.globalData.IsStationMaster = res.data.IsStationMaster
                            wx.setStorageSync('qsgUserInfo', res.data);
                            app.getWxUserInfo(function (wxUserInfo) {
                                app.setUserInfo(wxUserInfo);
                                app.getUserCenterInfo();
                                wx.navigateBack();
                            });
                            console.log(wx.getStorageSync('qsgUserInfo'))
                        }
                    });
                })
            })
        }
        wx.showToast({
            title: msg,
            icon: 'none',
            image: '',
            mask: true,
        });
    },
    
    verifyCheckCode: function(checkCode, successCallback) {
        var that = this;
        var url = app.getUrl(app.globalData.GetCheckPhoneCheckCode)
        var params = {
            openId: app.globalData.openId,
            checkCode: checkCode,
            contact: that.data.cellPhone
        };
        config.httpGet(url,
            params,
            function(res) {
                if (res.success && (successCallback instanceof Function)) {
                    successCallback(res.data);
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        mask: true,
                    });
                }
            });
    },
    //获取手机验证码
    bindSendCheckCode: function (imgCode, checkBind) {
        if (this.data.time > 0) {
            return;
        }
        var params = {
            contact: this.data.cellPhone
        };
        if (imgCode) {
            params.id = this.data.imgCodeData.Id;
            params.imageCheckCode = imgCode;
            params.checkBind = true;
        }
        var that = this,
            url = app.getUrl(app.globalData.GetPhoneCheckCode);
        config.httpGet(url,params,function (res) {
            var msg = '验证码已发送至您的手机';
            if (!res.success) {
                msg = res.msg;
            } else {
                that.setData({
                    time: 60
                });
                that.setTimePlay();
            }
            wx.showToast({
                title: msg,
                icon: 'none',
                duration: 2000,
                mask: true,
            })
        });
    },
    //验证码倒计时
    setTimePlay() {
        var that = this;
        setInterval(function () {
        that.setData({
            time: that.data.time - 1
        })
        }, 1000);
    },
})