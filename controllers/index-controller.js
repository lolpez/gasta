/**
 * @constructor
 * @version 1.0
 * @namespace
 * @class indexController
 */
var indexController = {
	/* GET login page. */
	loginPage: (req, res, next) => {
		if (req.user) {
			//user already logged
			console.log("im here");
			res.redirect("/app");
		} else {
			//user not logged
			console.log("im here 2----------------");
			res.render("login", {
				error: req.flash("error")
			});
		}
	},
	/* GET logout page. */
	logout: (req, res, next) => {
		req.logout();
		res.redirect("/");
	},
	/* POST authenticate user. */
	authenticate: (req, res, next) => {
		//Check is user exits in database, etc..
		res.redirect("/app");
	}
};

module.exports = indexController;
