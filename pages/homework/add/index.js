// pages/publish/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    picUrl: ''
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          picUrl: res.tempFilePaths[0]
        });
        wx.uploadFile({
          url: app.globalData.domain + '/api/fileupload/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var data = JSON.parse(res.data);
            if (data.code == 0) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              console.log(data)
              that.setData({
                picUrl: data.url
              })
            }
          },
          fail: function (res) {}
        })
      }
    })
  },

  saveArticle: function(e) {
    var that = this;
    var remark = e.detail.value.remark;
    var title = e.detail.value.title;

    var goods = {
      title: title,
      remark: remark
    };

    var action = "save";
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.globalData.domain + '/api/homework/' + action,
      header: {
        token: wx.getStorageSync('token')
      },
      method: "POST",
      data: goods,
      success: (res) => {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: "保存成功",
            showCancel: false,
            success: function(){
              wx.navigateBack({
                
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }

      },
      complete: function(res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  getCourseList: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/course/list',
      data: {

      },
      success: (res) => {
        if (res.data.code == 0) {
          that.setData({
            courseList: res.data.courseList
          })
        } else {

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getUserInfo: function(res) {
    var that = this;
    if (res.detail.errMsg == "getUserInfo:ok") {
      app.login(function(res) {
        console.log(res)
        that.setData({
          dialogvisible: false
        })
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  }
})