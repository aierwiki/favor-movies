let touch = {
  //拖拽数据
  startPoint: null,
  translateX: null,
  translateY: null,
  timeStampStart: null,
  timeStampEnd: null
};
const app = getApp()
Page({
  data: {
    isHider: false,
    isLoadingEnd: false,
    slideTimes: 0,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    touchDot: 0, //触摸时的原点
    coord: {
      x: 0,
      y: 0
    },
    curShowIdx: 0,
    movieData:[]
  },
  onLoad: function (option) {
    wx.showLoading({
      title: '加载中...',
    })
    //从后台获取用户的openid
    var self = this
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://fishmovie.top/login',
            data: {
              code: res.code
            },
            method: "post",
            success: res => {
              console.log(res.data)
              if (res.data.result == 0) {
                app.globalData.openid = res.data.openid
                self.loadRecommendData(res.data.openid)
              } else {
                console.log('后台获取openid失败！')
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              self.setData({
                userInfo: res.userInfo
              })
            }
          })
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          self.setData({
            isHide: true
          });
        }
      }
    })
  },
  loadRecommendData: function (openid) {
    //const app = getApp()
    //console.log(app.globalData)
    //const openid = this.globalData.openid
    //if (typeof app.globalData.openid != "undefined")
    if (true)
    {
      const requestTask = wx.request({
        url: 'https://fishmovie.top/recommend/' + openid,
        data: {
        },
        method: "get",
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res.data)
          for (var j = 0, len = res.data.movieData.length; j < len; j++) {
            res.data.movieData[j].zIndex = len - j;
            res.data.movieData[j].isRender = 1
            res.data.movieData[j].animationData = 0
          }
          var isLoadingEnd = false;
          if (res.data.movieData.length == 0) {
            isLoadingEnd = true;
          }
          this.setData({
            movieData: res.data.movieData,
            curShowIdx: 0,
            slideTimes: 0,
            isLoadingEnd: isLoadingEnd
          })
          wx.hideLoading()
        }
      })
    }
  },
  touchStart: function (e) {
    touch.startPoint = e.touches[0];
    let timeStampStart = new Date().getTime();
    this.animation = wx.createAnimation({
      duration: 70,
      timingFunction: 'ease',
      delay: 0
    })
    this.touch = {
      timeStampStart
    }

  },
  //触摸移动事件
  touchMove: function (e) {
    let movieData, rotate;
    let currentPoint = e.touches[e.touches.length - 1];
    let translateX = currentPoint.clientX - touch.startPoint.clientX;
    let translateY = currentPoint.clientY - touch.startPoint.clientY;
    if (translateX < 0) {
      if (translateX > -10) {
        rotate = -1;
      } else {
        rotate = -4;
      }
    }
    if (translateX > 0) {
      if (translateX < 10) {
        rotate = 1;
      } else {
        rotate = 4;
      }
    }
    this.animation.rotate(rotate).translate(translateX, 10).step();
    let id = this.data.curShowIdx;
    movieData = this.data.movieData;
    movieData[id].animationData = this.animation.export();
    this.setData({
      movieData
    })

  },
  // 触摸结束事件
  touchEnd: function (e) {
    // return;
    let movieData;
    let translateX = e.changedTouches[0].clientX - touch.startPoint.clientX;
    let translateY = e.changedTouches[0].clientY - touch.startPoint.clientY;
    let timeStampEnd = new Date().getTime();
    let time = timeStampEnd - this.touch.timeStampStart;
    let id = this.data.curShowIdx;
    let animation = wx.createAnimation({
      duration: 250,
      timingFunction: 'ease',
      delay: 0
    })
    if (time < 150) {
      //快速滑动
      if (translateX > 40) {
        //右划
        this.markAsRead('right');
        animation.rotate(0).translate(this.data.windowWidth, 0).step();
        movieData = this.data.movieData;
        movieData[id].animationData = animation.export();
        this.setData({
          movieData
        })
      } else if (translateX < -40) {
        //左划
        this.markAsRead('left');
        animation.rotate(0).translate(-this.data.windowWidth, 0).step();
        movieData = this.data.movieData;
        movieData[id].animationData = animation.export();
        this.setData({
          movieData
        })
      } else {
        //返回原位置
        animation.rotate(0).translate(0, 0).step();
        movieData = this.data.movieData;
        movieData[this.data.curShowIdx].animationData = animation.export();
        this.setData({
          movieData,
        })
      }
    } else {
      if (translateX > 160) {
        //右划
        this.markAsRead('right');
        animation.rotate(0).translate(this.data.windowWidth, 0).step();
        movieData = this.data.movieData;
        movieData[id].animationData = animation.export();
        this.setData({
          movieData
        })
      } else if (translateX < -160) {
        //左划
        this.markAsRead('left');
        animation.rotate(0).translate(-this.data.windowWidth, 0).step();
        movieData = this.data.movieData;
        movieData[id].animationData = animation.export();
        this.setData({
          movieData
        })
      } else {
        //返回原位置
        animation.rotate(0).translate(0, 0).step();
        movieData = this.data.movieData;
        movieData[this.data.curShowIdx].animationData = animation.export();
        this.setData({
          movieData,
        })
      }
    }
  },

  onLike: function () {
    this.clickAnimation({
      direction: 'right'
    });
    this.markAsRead('right')
  },
  onUnlike: function () {
    this.clickAnimation({
      direction: 'left'
    })
    this.markAsRead('left');
  },

  markAsRead: function (param) {
    let id = this.data.curShowIdx;
    console.log('id=' + id)
    let movieData = this.data.movieData;
    let slideTimes = this.data.slideTimes;
    slideTimes++;
    console.log('movie len=' + this.data.movieData.length)
    console.log('slide times=' + slideTimes)
    // 保存到后端
    this.recordHistory(param)
    let nextId = this.data.curShowIdx + 1;
    this.setData({
      curShowIdx: nextId,
      slideTimes
    })
    this.deleteItem(id)
    if (slideTimes == this.data.movieData.length) {
      console.log('slide finished!')
      this.setData({
        isLoadingEnd: true
      })
      this.loadRecommendData(app.globalData.openid)
    }
  },
  recordHistory: function(param) {
    var url = ""
    if (param == 'left') {
      url = 'https://fishmovie.top/dislike/' + app.globalData.openid
    } else {
      url = 'https://fishmovie.top/like/' + app.globalData.openid
    }
    const requestTask = wx.request({
      url: url,
      data: {
        movieid: this.data.movieData[this.data.curShowIdx].movieId
      },
      method: "get",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        console.log(res.data.result)
      }
    })
  },
  clickAnimation: function (params) {
    let x, y, duration, rotate, movieData;
    duration = 700;
    y = 100;
    if (params.direction === 'left') {
      rotate = -10;
      x = -this.data.windowWidth - 100;
    } else {
      rotate = 10;
      x = this.data.windowWidth + 100;
    }

    this.animation = wx.createAnimation({
      duration,
      timingFunction: 'ease',
      delay: 0
    })
    let id = this.data.curShowIdx;
    this.animation.rotate(rotate).translate(x, y).step();
    movieData = this.data.movieData;
    movieData[id].animationData = this.animation.export();
    this.setData({
      movieData
    })
  },
  deleteItem: function (id) {
    let movieData = this.data.movieData;
    for (let i = 0; i <= id; i++) {
      movieData[i].isRender = false;
    }
    this.setData({
      movieData
    })
  },
  toUserList: function () {
    try {
      wx.navigateTo({
        url: '/pages/like/like'
      });
    } catch (e) {
      console.log(e);
    } finally {

    }
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      this.setData({
        userInfo: e.detail.userInfo
      })
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  onShareAppMessage: function () {
    return {
      title: '电影心愿单',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      }
    }
  }
})
