// pages/scan/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:["/images/head1.png","/images/head2.png"],
    notice:[
      {
          "image": "/images/head1.png",
          "title": "授课1",
        },{
          "image": "/images/head2.png",
          "title": "科普2",
        }
    ],
    hotItem:{
      url:"/images/head1.png",
      name:"暂无",
      userId:"暂无"
    }
  },

  showResult: function(){
    wx.navigateTo({
      url: '/pages/result/list/index',
    })
  },

  result: function(){
    wx.navigateTo({
      url: '/pages/result/add/index',
    })
  },

  showHomework(e){
    wx.navigateTo({
      url: '/pages/homework/list/index',
    })
  },

  homework(e){
    wx.navigateTo({
      url: '/pages/homework/add/index',
    })
  },

  course(e){
    wx.navigateTo({
      url: '/pages/course/add/index',
    })
  },

  showCourse(e){
    wx.navigateTo({
      url: '/pages/course/list/index',
    })
  },

  notice(e){
    wx.navigateTo({
      url: '/pages/msg/list/index',
    })
  },

  attendance(e){
    wx.navigateTo({
      url: '/pages/attendance/index',
    })
  },


  sign(e){
    wx.navigateTo({
      url: '/pages/attendance/sign/index',
    })
  },

  querySign(e){
    wx.navigateTo({
      url: '/pages/attendance/sign-list/index',
    })
  },

  showAttendance(e){
    wx.navigateTo({
      url: '/pages/apply/examine/index',
    })
  },

  apply(e) {
    wx.navigateTo({
      url: '/pages/apply/add/index',
    })
  },
  getCourse: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/course/list',
      data: {
        token: wx.getStorageSync('token'),
        page:1,
        limit:4,
        courseType:'img'
      },
      success: function (res) {
        if (res.data.code == 0 && res.data.rows.length>0) {
          let imgArray = [];
          res.data.rows.forEach(element => {
            imgArray.push(app.globalData.domain + '/api/fileupload/getFile/' + encodeURIComponent(element.coursePath));
          });
          if (imgArray.length>0) {
            var ob =  res.data.rows.slice(res.data.rows.length-1)[0];
            ob.coursePath =app.globalData.domain + '/api/fileupload/getFile/' + encodeURIComponent(ob.coursePath);
            console.log(ob);
            that.setData({
              banners: imgArray.slice(0,3),
              hotItem:{
                url:ob.coursePath,
                name:ob.courseName,
                userId:ob.user.realName
              }
            })
          }
        
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求轮播图
    this.getCourse();
  },

  logout: function(){
    app.globalData.userInfo = null;
    wx.redirectTo({
      url: '/pages/login/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
          that.setData({
            member: res.data.member
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.getStorageSync('token')){
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }else{
      this.setData({
        userType: wx.getStorageSync('userType')
      })
      var menuList = [
        // { name: "课程查询", icon: "/images/huanzhuangchaxun2.png", url: "/pages/course/list/index" },
        { name: "作业查询", icon: "/images/zuoye2.png", url: "/pages/homework/list/index" },
        { name: "提交作业", icon: "/images/faqizuoye2.png", url: ""},
        { name: "查看成绩", icon: "/images/tubiaozhizuomoban2.png", url: "/pages/result/list/index" },
        // { name: "报名课程", icon: "/images/myadd.png", url: ""},
        // { name: "通知公告", icon: "/images/tongzhi.png", url: "/pages/msg/list/index" }
      ];
      if(wx.getStorageSync('userType') == 2){
        menuList = [
          { name: "科普申请", icon: "/images/tongyongyewushenqing.png", url: "/pages/apply/add/index" },
          { name: "布置作业", icon: "/images/zuoye.png", url: "/pages/homework/add/index" },
          // { name: "请假审核", icon: "/images/examine.png", url: "/pages/apply/examine/index" },
          { name: "发布成绩", icon: "/images/chengjidan-.png", url: "/pages/result/add/index" },
           { name: "发布内容", icon: "/images/kecheng.png", url: "/pages/course/add/index" },
           { name: "通知公告", icon: "/images/tongzhi.png", url: "/pages/msg/list/index" }
          // { name: "课堂考勤", icon: "/images/sign.png", url: "/pages/attendance/sign/index" }
        ]
      }
      this.setData({
        menuList:  menuList
      })
    }
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
