// pages/publish/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentIndex: 0,
    studentList: [],
    courseList: [],
    courseIndex: 0,
    title: '',
    type: 1,
    address: '',
    longitude: 0,
    latitude: 0
  },

  radioChange: function(e) {
    this.setData({
      type: e.detail.value
    })
  },

  bindStudentChange: function(e) {
    this.setData({
      studentIndex: e.detail.value
    })
  },

  bindCourseChange: function (e) {
    this.setData({
      courseIndex: e.detail.value
    })
  },

  saveArticle: function(e) {
    var that = this;
    var remarks = e.detail.value.describe;

    var goods = {
      userId: that.data.studentList[that.data.studentIndex].id,
      courseId: that.data.courseList[that.data.courseIndex].id,
      score: e.detail.value.score,
      remark: remarks
    };

    var action = "save";
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.globalData.domain + '/api/result/' + action,
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
    this.getUserList();
    this.getCourseList();
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

  getUserList: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/member/list',
      data: {
        userType: 1
      },
      success: (res) => {
        if (res.data.code == 0) {
          that.setData({
            studentList: res.data.memberList
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