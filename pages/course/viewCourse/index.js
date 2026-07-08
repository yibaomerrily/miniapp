// pages/courseCopy/viewCourse/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseType: "video",
    src: "",
    srcArray: [],
    vidoSet: {
      "enableAutoRotation": true, //是否开启手机横屏时自动全屏，当系统设置开启自动旋转时生效
      "showScreenLockButton": true, //锁屏
      "showSnapshotButton": true //是否显示锁屏按钮，仅在全屏时显示，锁屏后控制栏的操作
    }
  },
  bindClickImg: function (e) {
    var that = this;
    wx.showLoading({
      title: '图片加载中',
      mask: true
    })
    wx.previewImage({
      current: that.data.src, // 当前显示图片的http链接，注意这里不能放本地图片
      urls: that.data.srcArray, // 需要预览的图片http链接列表，注意这里不能放本地片
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {
        wx.hideLoading();
      },
    })
  },
  closeLoading: function (e) {
    wx.hideLoading();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let ob = JSON.parse(options.item);
    let src = "";

    if (ob.courseType == "img") {
      src = app.globalData.domain + '/api/fileupload/getFile/' + encodeURIComponent(ob.coursePath);
      let srcArry = [];
      srcArry.push(src);
      this.setData({
        src: src,
        srcArray: srcArry,
        courseType: ob.courseType
      });
    } else {
      src = app.globalData.domain + '/api/fileupload/getVideo/' + encodeURIComponent(ob.coursePath);
      let srcArry = [];
      this.setData({
        src: src,
        srcArray: srcArry,
        courseType: ob.courseType
      });
      // wx.downloadFile({
      //   url: app.globalData.domain + '/api/fileupload/getFile/' + encodeURIComponent(ob.coursePath),
      //   header: {
      //     'token': wx.getStorageSync('token')
      //   },
      //   success: function (res) {
      //     const filePath = res.tempFilePath;
      //     wx.hideLoading();
      //     that.setData({
      //       src: filePath
      //     });
      //   },
      //   fail: function (res) {
      //     wx.hideLoading();
      //     wx.showToast({
      //       title: '视频打开失败',
      //       icon: 'none',
      //       duration: 2000
      //     })
      //   }
      // })
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})