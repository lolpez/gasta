var mongodb = require("mongodb");
/**
 * @constructor
 * @version 1.0
 * @namespace
 * @class indexController
 */
var tokens = {};
var indexController = {
	/* GET login page. */
	loginPage: (req, res, next) => {
		if (req.user) {
			//user already logged
			res.redirect("/app");
		} else {
			//user not logged
			res.render("login", {
				error: req.flash("error")
			});
		}
	},
	/* GET logout page. */
	logout: (req, res, next) => {
		// clear the remember me cookie when logging out
		res.clearCookie("remember_me");
		req.logout();
		res.redirect("/");
	},
	/* POST authenticate user. */
	authenticate: (req, res, next) => {
		//Check is user exits in database, etc..
		// Issue a remember me cookie if the option was checked
		if (!req.body.remember_me) { return next(); }

		req.app.get("issueToken")(req.user, function (err, token) {
			if (err) { return next(err); }
			res.cookie("remember_me", token, { path: "/", httpOnly: true, maxAge: 604800000 });
			return next();
		});
	}
};

module.exports = indexController;
