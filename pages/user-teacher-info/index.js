//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },

  bindCancel: function () {
    wx.navigateBack({})
  },

  onLoad: function () {
    this.getUserInfo();
  },

  bindSave: function (e) {
    var that = this;
    var realName = e.detail.value.realName;
    var mobile = e.detail.value.mobile;
    if (realName == "") {
      wx.showModal({
        title: '提示',
        content: '请填写姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }

    wx.request({
      url: app.globalData.domain + '/api/member/update',
      method: "POST",
      header: {
        "token": wx.getStorageSync('token')
      },
      
      data: {
        realName: realName,
        mobile: mobile,
        position: e.detail.value.position,
        subject: e.detail.value.subject,
        id: that.data.userInfo.id
      },
      success: function (res) {
        if (res.data.code != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        // 跳转到结算页面
        wx.showToast({
          title: '修改成功',
        })
        wx.navigateBack({})
      }
    })
  },

  
  uploadAvatar(){
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        wx.uploadFile({
          url: app.globalData.domain + '/api/fileupload/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {
            imageType: "goodsImage"
          },
          success: function(res) {
            var data = JSON.parse(res.data);
            if (data.code == 0) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              var userInfo = that.data.userInfo;
              userInfo.avatarUrl = data.url;

              that.setData({
                userInfo: userInfo
              })
            }
          },
          fail: function(res) {
            wx.showToast({
              title: '上传失败',
              duration: 2000
            })
          }
        })
      }
    })
  
  },

  getUserInfo: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/member/info',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        that.setData({
          userInfo: res.data.member
        })
      }
    })
  }


})