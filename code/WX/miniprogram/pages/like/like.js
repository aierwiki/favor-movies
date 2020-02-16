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
    this.loadFavorateData()
  },
  loadFavorateData: function () {
    wx.cloud.callFunction({
      name: "favorite",
      data: {
      },
      complete: res => {
        console.log(res.result)
        for (var j = 0, len = res.result.movieData.length; j < len; j++) {
          res.result.movieData[j].zIndex = len - j;
          res.result.movieData[j].isRender = 1
          res.result.movieData[j].animationData = 0
        }
        var isLoadingEnd = false;
        if (res.result.movieData.length == 0) {
          isLoadingEnd = true;
        }
        this.setData({
          movieData: res.result.movieData,
          curShowIdx: 0,
          slideTimes: 0,
          isEmpty: false,
          isLoadingEnd: isLoadingEnd
        })
        wx.hideLoading()
      }
    })
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
