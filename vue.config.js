const path = require('path')
const appData = require('./data.json')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    before(app) {
      app.get('/api/seller', function(req, res) {
        res.json({
          errno: 0,
          data: appData.seller
        })
      })
      app.get('/api/goods', function(req, res) {
        res.json({
          errno: 0,
          data: appData.goods
        })
      })
      app.get('/api/ratings', function(req, res) {
        res.json({
          errno: 0,
          data: appData.ratings
        })
      })
    }
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
  },
  publicPath: ''
}
