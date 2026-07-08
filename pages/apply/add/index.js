// pages/publish/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    endDate: '',
    teacherList: [],
    teacherIndex: 0,
    picUrl: ''
  },

  getTeacher(e){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/member/list',
      data: {
        userType: 2
      },
      success: function (res) {
        that.setData({
          teacherList: res.data.memberList
        })
      }
    })
  },

  changeDate(e) {
    this.setData({
      date: e.detail.value
    })
  },

  changeEndDate(e) {
    this.setData({
      endDate: e.detail.value
    })
  },

  save: function(e) {
    var that = this;
    var remark = e.detail.value.remark;

    var leave = {
      startDate: this.data.date,
      endDate: this.data.endDate,
      picUrl: this.data.picUrl,
      remark: remark
    };

    var action = "save";
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.globalData.domain + '/api/leave/' + action,
      header: {
        token: wx.getStorageSync('token')
      },
      method: "POST",
      data: leave,
      success: (res) => {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: "提交成功",
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

  chooseVedio:function(e){
    var _this = this;
    wx.chooseVideo({
      success: function(res) {
        _this.setData({
          src: res.tempFilePath,
        })
      }
    })
  },
    /**
   * 上传视频 目前后台限制最大100M, 以后如果视频太大可以选择视频的时候进行压缩
   */
          uploadvideo:function(){
            var src = this.data.src;
    wx.uploadFile({
      url: '',
      methid: 'POST',           // 可用可不用
      filePath: src,
      name: 'files',              // 服务器定义key字段名称
      header: app.globalData.header,
      success: function() {
        console.log('视频上传成功')
      },
      fail: function() {
        console.log('接口调用失败')

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
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