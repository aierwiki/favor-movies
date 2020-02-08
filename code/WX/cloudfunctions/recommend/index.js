// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //let url = 'https://www.baidu.com'
  /*
  return await rp(url)
    .then(function(res){
      return res
    })
    .catch(function(err){
      return 'fail'
    })
  */
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    movieData: [
      {
        name: 'PAN',
        score: 9.2,
        picUrl: 'http://getimdb.com/posters/tt3332064.jpg',
        zIndex: 10000,
        isRender: true,
        animationData: null
      },
      {
        name: 'TEST1',
        score: 8.2,
        picUrl: 'http://getimdb.com/posters/tt1816608.jpg',
        zIndex: 9999,
        isRender: true,
        animationData: null
      },
      {
        name: 'TEST1',
        score: 7.2,
        picUrl: 'http://getimdb.com/posters/tt2717822.jpg',
        zIndex: 9998,
        isRender: true,
        animationData: null
      }]
  }
}