const express = require("express");
const passport = require("passport");
const router = express.Router();
const indexController = require("../controllers/index-controller");

router.get("/", indexController.loginPage);
router.get("/logout", requiresUserLogged, indexController.logout);
router.post("/", passport.authenticate("local", { failureRedirect: "/", failureFlash: true, badRequestMessage: "Incorrect data." }), indexController.authenticate);

function requiresUserLogged(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.redirect("/");
	}
}

module.exports = router;

