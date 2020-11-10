module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': { // 正则匹配到以这个开头的时候 就用代理
        target: 'http://www.chst.vip', // 指向的是目标服务器
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
