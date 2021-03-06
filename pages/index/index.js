//index.js
//获取应用实例
const AV = require('../../utils/av-weapp-min.js');
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.lcUserInfo) {
      this.setData({
        userInfo: app.globalData.lcUserInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.lcUserInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.lcUserInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  lcCreateWechatPayment: function(e) {
    console.log(app.globalData.lcUser.authData.lc_weapp.openid);
    AV.Cloud.run(
      "createWechatPayment", 
      { 
        productName: "ChenTest",
        userOpenId: app.globalData.lcUser.authData.lc_weapp.openid,
        totalFee: "1"
      },
      {remote: true}
    ).then(function(data) {
      console.log("Success call:" + data);
    }, function(err) {
      console.log("Fail call:" + err);
    });
  },
  showDataPage: function(e) {
    wx.navigateTo({
      url: '../data/detail'
    })
  }
})
