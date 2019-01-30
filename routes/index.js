var express = require('express')
var router = express.Router()

var indexRouter = (io) => {
  /* GET home page. */
  var indexController = require('../controllers/index-controller')(io)
  router.get('/', indexController.mainPage)
  return router
}

module.exports = indexRouter
