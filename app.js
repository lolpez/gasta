const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
var passport = require("passport");
var Strategy = require("passport-local").Strategy;
var flash = require("connect-flash");

const indexRouter = require("./routes/index");
const appRouter = require("./routes/app");


const app = express();
const io = app.io = require("socket.io")();
const ioGasta = io.of("/socket-gasta");

// Passport
passport.use(new Strategy(function (username, password, callback) {
	if (username === "admin" && password === "password") {
		return callback(null, { id: 666, name: "Jose", lastName: "Luis", email: "luis@gmail.com", role: "manager" });
	} else {
		return callback(null, false);
	}
}));

passport.serializeUser(function (user, callback) {
	callback(null, user.id);
});

passport.deserializeUser(function (id, callback) {
	if (id === 666) {
		callback(null, { id: 666, name: "Jose", lastName: "Luis", email: "luis@gmail.com", role: "manager" });
	} else {
		//The user does not exists
		return callback(null, false);
	}
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// passport
app.use(require("express-session")({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/", indexRouter);
app.use("/app", appRouter(ioGasta));

// use HTTPS
app.use(function (req, res, next) {
	if (!req.secure) {
		return res.redirect(`https://${req.get("Host")}${req.url}`);
	}
	next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
