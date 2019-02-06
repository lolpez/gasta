const express = require("express");
const router = express.Router();

const appRouter = (io) => {
	/* GET home page. */
	const appController = require("../controllers/app-controller")(io);
	router.get("/", ensureAuthenticated, appController.appPage);
	return router;
};


function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect("/");
}

module.exports = appRouter;
