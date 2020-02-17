const express = require('express')

const app = express()

const appData = require('./data.json')

const router = express.Router()

router.get('/seller', function(req, res) {
  res.json({
    errno: 0,
    data: appData.seller
  })
})
router.get('/goods', function(req, res) {
  res.json({
    errno: 0,
    data: appData.goods
  })
})
router.get('/ratings', function(req, res) {
  res.json({
    errno: 0,
    data: appData.ratings
  })
})

app.use('/api', router)

app.use(express.static('./dist'))

const port = process.env.PORT || 8900

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
