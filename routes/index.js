var express = require("express");
var router = express.Router();
var indexController = require('../controllers/index-controller');

var indexRouter = (io) => {
	/* GET home page. */
	router.get('/', indexController(io).mainPage);
	return router;
}

module.exports = indexRouter;