
// Init leancould
const AV = require('utils/av-weapp-min.js');
AV.init({
  appId: '7XYHK9Nfk9CGgU02BbGd7AEA-gzGzoHsz',
  appKey: 'WvDzWc5GgmqqTWA3VpuvGmSv',
});

const Bmob = require('utils/bmob.js');
Bmob.initialize(
  "e11e12d3cb1af1583765a66d652f2dc3", 
  "14b035dad91519854f1c962def3e1950"
  );

//app.js
App({
  onLaunch: function () {
    // Bmob login
    wx.login({
      success: function(res) {
        if (res.code) {
          Bmob.User.requestOpenId(res.code, {
            success: function(userData) {
              wx.getUserInfo({
                success: function(result) {
                  var userInfo = result.userInfo;
                  var nickName = userInfo.nickName;
                  this.globalData.bmobUserInfo = userInfo;

                  var user = new Bmob.User();
                  user.set("username", nickName);
                  user.set("password", userData.openid);
                  user.set("userData", userData);
                  user.signUp(null, {
                    success: function(res) {
                      console.log("Sign up bmob account success. " + nickName);
                    },
                    error: function(userData, err) {
                      console.log("++++Error:" + err);
                    }
                  });
                }
              });
            }, 
            error: function(err) {
              console.log("++++Error:" + err.code + " " + err.message);
            }
          });
        }
      }
    });

    // LeanCloud login
    AV.User.loginWithWeapp().then(user => {
      console.log("User login");
      this.globalData.lcUser = user.toJSON();
    }).catch(console.error);

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.lcUserInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
  },
  globalData: {
    lcUser: null,
    lcUserInfo: null,
    bmobUser: null,
    bmobUserInfo: null
  }
})