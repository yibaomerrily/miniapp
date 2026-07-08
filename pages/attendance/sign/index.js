// pages/sign/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList: [],
    clsList: [],
    clsIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCls();
  },

  getCls(){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/cls/list',
      data: {
        token: wx.getStorageSync('token'),
      },
      success: function (res) {
        that.setData({
          clsList: res.data.clsList
        })

        that.getUser()
      }
    })
  },

  bindClsChange(e){
    this.setData({
      clsIndex: e.detail.value
    })
    this.getUser()
  },

  getUser(){
    var that = this;
    var clsId = this.data.clsList[this.data.clsIndex].id
    wx.request({
      url: app.globalData.domain + '/api/member/list',
      data: {
        token: wx.getStorageSync('token'),
        userType: 1,
        classId: clsId
      },
      success: function (res) {
        that.setData({
          userList: res.data.memberList
        })
      }
    })
  },

  saveAttendance(e){
    wx.showLoading({
      title: '正在提交',
    })

    var signList = [];

    var map = e.detail.value;
    for (let key in map) {
      signList.push({ userId: key, status: map[key]})
    }
    
    wx.request({
      url: app.globalData.domain + '/api/sign/save',
      header: {
        token: wx.getStorageSync('token')
      },
      method: "POST",
      data: signList,
      success: (res) => {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: "保存成功",
            showCancel: false,
            success: function () {
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
      complete: function (res) {
        wx.hideLoading();
      }
    })
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