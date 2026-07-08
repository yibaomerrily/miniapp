const app = getApp()

Page({
  data: {
    list: [
      { "name": "我的信息", "url": "/pages/user-info/index" },
      { "name": "修改密码", "url": "/pages/password/index" },
      { "name": "关于我们", "url": "/pages/aboutUs/aboutUs" },
      {"name": "意见反馈", "url": "/pages/opinion/opinion"}    ]
  },

  onLoad() {

  },

  logout(){
    wx.removeStorage({
      key: 'token',
    })
    this.setData({
      member: null
    })
  },

  tabNav: function(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

  onShow() {
    if (!wx.getStorageSync('token')) {
      return;
    }

    this.getMember();
  },

  getMember: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/member/info',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          res.data.member.avatarUrl = app.globalData.domain + '/api/fileupload/getFile/' + encodeURIComponent(res.data.member.avatarUrl);
          that.setData({
            member: res.data.member
          })
          var userType = res.data.member.userType;
          if(userType == 1){
            var list = [
              { "name": "我的信息", "url": "/pages/user-info/index" },
              { "name": "修改密码", "url": "/pages/password/index" },
              { "name": "关于我们", "url": "/pages/aboutUs/aboutUs" },
              {"name": "意见反馈", "url": "/pages/opinion/opinion"}            ]
            that.setData({
              list: list
            })
          }

          
        }
      }
    })
  },

  // onShareAppMessage: function () {
  //   var path = '/pages/index/index';
  //   if (app.globalData.distributor) {
  //     path = path + "?distributor=" + app.globalData.distributor;
  //   }
  //   return {
  //     title: wx.getStorageSync('storeName'),
  //     path: path,
  //     imageUrl: app.globalData.domain + '/images/personal-off.png',
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // },
  
  login: function(){
    wx.navigateTo({
      url: '/pages/login/index',
    })
  }

})
