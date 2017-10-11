// pages/data/detail.js
const AV = require('../../utils/av-weapp-min.js');
const app = getApp()

Page({

  data: {
    orders: null,
  },
  lcCreateOrder: function(e) {
    console.log("Create data.");
    var WechatOrder = AV.Object.extend("WechatOrder");
    var order = new WechatOrder();
    order.set("productName", "Test" + new Date());
    order.set("openId", app.globalData.user.authData.lc_weapp.openid);
    order.set("totalFee", 1);
    order.set("outTradeNo", new Date());

    order.save().then(function(obj) {
      console.log("New create id" + obj.id);
    });
  },
  lcQueryOrder: function(e) {
    console.log("Query data.");
    var query = new AV.Query("WechatOrder");
    query.find().then(results => {
        this.setData({ orders: results });
        console.log(results);
      }).catch(console.error);
  }
  
})