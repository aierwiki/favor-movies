const app = getApp()
Page({
  data: {
    isEmpty: true,
    isLoading: false,
    isLoadingEnd: false,
    movieData: [],
    userInfo: {

    }
  },
  onLoad: function (option) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.setNavigationBarTitle({
      title: '我的心愿单'
    })
    console.log(app)
    if (typeof app.globalData.openid != 'undefined') {
      this.loadFavorateData(app.globalData.openid)
    }
  },
  loadFavorateData: function (openid) {
    //const app = getApp()
    //console.log(app.globalData)
    //const openid = this.globalData.openid
    //if (typeof app.globalData.openid != "undefined")
    if (true) {
      const requestTask = wx.request({
        url: 'https://fishmovie.top/favorite/' + openid,
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
            isEmpty: false,
            isLoadingEnd: isLoadingEnd
          })
          wx.hideLoading()
        }
      })
    }
  },
  lower: function () {
    /*
    if (!this.data.isLoadingEnd && !this.data.isLoading) {
      wx.showLoading({
        title: '加载中...',
      })
      let fromId = this.data.listArr[this.data.listArr.length - 1];
      this.getList({
        fromId,
        success: (data) => {
          wx.hideLoading();
          if (data.length === 0) {
            this.setData({
              isLoadingEnd: true
            })
            return;
          }
          let listArr = [].concat(this.data.listArr),
            movieData = Object.assign({}, this.data.movieData);
          for (let i = 0; i < data.length; ++i) {
            let id = data[i].id;
            listArr.push(data[i].id);
            movieData[id] = data[i].attributes.movie.attributes;
          }
          this.setData({
            listArr,
            movieData
          })
        }
      });
    }*/
  },
  bindtouchstart: function (e) {

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
