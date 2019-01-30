var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.render("test", { title: "Test" });
});

router.get("/:id", function (req, res, next) {
	var page = req.params.id;
	res.render("page", { title: `Page ${page}` });
});

module.exports = router;
