const express = require("express");
const router = express.Router();

const appRouter = (io) => {
	/* GET home page. */
	const appController = require("../controllers/app-controller")(io);
	router.get("/", appController.appPage);
	return router;
};

module.exports = appRouter;
