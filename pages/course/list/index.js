// pages/course/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCourse();
  },

  getCourse: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/course/list',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        that.setData({
          courseList: res.data.courseList
        })
      }
    })
  },
  getPage: function (e) {
    let ob = e.currentTarget.dataset.item;
    //判断是否不含内容
    if (ob.coursePath != null && ob.coursePath != "") {
      //如果是文档那就在本页显示，如果是图片就跳转显示
      if (ob.courseType == "doc") {
        wx.showLoading({
          title: '文档加载中',
          mask: true
        })
        wx.downloadFile({
          url: app.globalData.domain + '/api/fileupload/getFile/' + encodeURIComponent(ob.coursePath),
          header: {
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            const filePath = res.tempFilePath;
            setTimeout(function () {
              wx.openDocument({
                filePath: filePath,
                fileType: ob.coursePath.slice((ob.coursePath.indexOf('.')+1)),
                success: function (res) {
                  wx.hideLoading();
                },
                fail :function (res) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '文档打开失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            }, 3000);
          },
          fail :function (res) {
            wx.hideLoading();
            wx.showToast({
              title: '文档打开失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/course/viewCourse/index?item=' + JSON.stringify(ob)
        })
      }

    } else {
      wx.showToast({
        title: '课程暂无内容',
        icon: 'none',
        duration: 2000
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
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