const express = require("express");
const router = express.Router();

const indexRouter = (io) => {
	/* GET home page. */
	const indexController = require("../controllers/index-controller")(io);
	router.get("/", indexController.mainPage);
	return router;
};

module.exports = indexRouter;
