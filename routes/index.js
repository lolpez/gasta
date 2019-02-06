const express = require("express");
const passport = require("passport");
const router = express.Router();
const indexController = require("../controllers/index-controller");

router.get("/", indexController.loginPage);
router.get("/logout", indexController.logout);
router.post("/", passport.authenticate("local", { failureRedirect: "/", failureFlash: true }), indexController.authenticate,
	function (req, res) {
		res.redirect("/app");
	});

module.exports = router;

