// pages/courseCopy/add/index.js
const app = getApp();
const moment = require("../../../utils/dayjs.min")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: "",
    courseName: "请选择已授权课程",
    courseId: null,
    courseTime: moment(new Date()).format('YYYY-MM-DD'),
    mode: "scaleToFill",
    filePath: "",
    fileName: "",
    tempImagePath: "", // 拍照的临时图片地址
    tempVideoPath: "", // 录制视频的临时视频地址
    tempFilePath: "",
    courseType: "doc",
    fileSize: 0,
    items: [{
        name: 'img',
        value: '图片'
      },
      {
        name: 'doc',
        value: '文档',
        checked: 'true'
      },
      {
        name: 'video',
        value: '视频'
      }
    ],
    acceptFileType: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf'],
    courseList:[]
  },
  //请求用户当前授权申请的课程
  getCourse: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/leave/getAuthList',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data.rows);
        that.setData({
          courseList: res.data.rows
        })
      }
    });

  },
  bindPickerChange: function (e) {
    let num  = parseInt(e.detail.value);
    this.setData({
      courseName: this.data.courseList[num].remark,
      courseId:this.data.courseList[num].id,
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      courseName: e.detail.value
    })
  },
  bindKeyAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  bindKeyCourseTime: function (e) {
    this.setData({
      courseTime: e.detail.value
    })
  },
  radioChange: function (e) {
    this.setData({
      courseType: e.detail.value
    })
    switch (this.data.courseType) {
      case 'img':
        this.setData({
          tempVideoPath: "", // 录制视频的临时视频地址
          tempFilePath: "",
          fileName: "",
          fileSize: ""
        })
        break;
      case 'video':
        this.setData({
          tempImagePath: "", // 拍照的临时图片地址
          tempFilePath: "",
          fileName: "",
          fileSize: ""
        })
        break;
      case 'doc':
        this.setData({
          tempImagePath: "", // 拍照的临时图片地址
          tempVideoPath: "", // 录制视频的临时视频地址
          fileName: "",
          fileSize: ""
        })
        break;
      default:
        break;
    }
  },
  addImg: function (e) {
    var that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success(res) {
        that.setData({
          tempImagePath: res.tempFiles[0].tempFilePath,
          fileName: res.tempFiles[0].tempFilePath.slice((res.tempFiles[0].tempFilePath.indexOf('.') - 10)),
          fileSize: res.tempFiles[0].size
        })
      }
    })
  },
  deleteImg: function (e) {
    this.setData({
      tempImagePath: "",
      fileName: "",
      fileSize: 0
    })
  },
  addVideo: function (e) {
    var that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album'],
      sizeType: ['original', 'compressed'],
      success(res) {
        that.setData({
          tempVideoPath: res.tempFiles[0].tempFilePath,
          fileName: res.tempFiles[0].tempFilePath.slice((res.tempFiles[0].tempFilePath.indexOf('.') - 10)),
          fileSize: res.tempFiles[0].size
        })
      }
    })
  },
  deleteVideo: function (e) {
    this.setData({
      tempVideoPath: "",
      fileName: "",
      fileSize: 0
    })
  },
  addDoc: function (e) {
    var that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        //判断是否是可接受类型课程
        let fileType = res.tempFiles[0].name.slice((res.tempFiles[0].name.indexOf('.')));
        if (that.data.acceptFileType.indexOf(fileType) > -1) {
          that.setData({
            tempFilePath: res.tempFiles[0].path,
            fileName: res.tempFiles[0].name,
            fileSize: res.size
          })
        } else {
          wx.showToast({
            title: '文件类型不符合要求',
            icon: 'none',
            duration: 2000
          });
        }

      }
    })
  },
  deleteDoc: function (e) {
    this.setData({
      tempFilePath: "",
      fileName: "",
      fileSize: 0
    })
  },
  addFileSelect: function (e) {
    switch (this.data.courseType) {
      case 'img':
        this.addImg(e);
        break;
      case 'video':
        this.addVideo(e);
        break;
      case 'doc':
        this.addDoc(e);
        break;
      default:
        break;
    }
  },
  delFileSelect: function (e) {
    switch (this.data.courseType) {
      case 'img':
        this.deleteImg(e);
        break;
      case 'video':
        this.deleteVideo(e);
        break;
      case 'doc':
        this.deleteDoc(e);
        break;
      default:
        break;
    }
  },
  saveFile: function (e) {
    var that = this;
    switch (this.data.courseType) {
      case 'img':
        this.data.filePath = this.data.tempImagePath;
        break;
      case 'video':
        this.data.filePath = this.data.tempVideoPath;
        break;
      case 'doc':
        this.data.filePath = this.data.tempFilePath;
        break;
      default:
        break;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.uploadDoFile();
  },
  uploadDoFile: function () {
    var that = this;
    wx.uploadFile({
      url: app.globalData.domain + '/api/fileupload/uploadCourse',
      filePath: that.data.filePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': '*/*',
        'token': wx.getStorageSync('token')
      },
      formData: {
        address: that.data.address,
        courseName: that.data.courseName,
        courseTime: moment(this.data.courseTime).format('YYYY-MM-DD').toString(),
        courseType: that.data.courseType,
        courseId:that.data.courseId
      },
      success(res) {
        var ob = JSON.parse(res.data);
        if (ob.code == 0) {
          wx.showToast({
            title: '保存课程成功',
            icon: 'success',
            duration: 2000
          });
          wx.hideLoading();
          that.setData({
            address: "",
            courseName: "请选择已授权课程",
            courseTime: moment(new Date()).format('YYYY-MM-DD'),
            filePath: "",
            fileName: "",
            tempImagePath: "", // 拍照的临时图片地址
            tempVideoPath: "", // 录制视频的临时视频地址
            tempFilePath: ""
          })
        } else {
          wx.showToast({
            title: ob.msg,
            icon: 'none',
            duration: 2000
          });
          wx.hideLoading();
        }
      },
      fail(res) {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        });
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCourse();
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