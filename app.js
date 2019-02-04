const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const RememberMeStrategy = require("passport-remember-me").Strategy;
const flash = require("connect-flash");
const mongodb = require("mongodb");

const indexRouter = require("./routes/index");
const appRouter = require("./routes/app");

const app = express();
const io = app.io = require("socket.io")();
const ioGasta = io.of("/socket-gasta");

// Passport
var users = [
	{ id: 1, username: "bob", password: "secret", email: "bob@example.com" }
	, { id: 2, username: "joe", password: "birthday", email: "joe@example.com" }
];

function findById(id, fn) {
	var idx = id - 1;
	if (users[idx]) {
		fn(null, users[idx]);
	} else {
		fn(new Error("User " + id + " does not exist"));
	}
}

function findByUsername(username, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	findById(id, function (err, user) {
		done(err, user);
	});
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
	function (username, password, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {

			// Find the user by username.  If there is no user with the given
			// username, or the password is not correct, set the user to `false` to
			// indicate failure and set a flash message.  Otherwise, return the
			// authenticated `user`.
			findByUsername(username, function (err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false, { message: "Unknown user " + username }); }
				if (user.password !== password) { return done(null, false, { message: "Invalid password" }); }
				return done(null, user);
			});
		});
	}
));

// Remember Me cookie strategy
//   This strategy consumes a remember me token, supplying the user the
//   token was originally issued to.  The token is single-use, so a new
//   token is then issued to replace it.
passport.use(new RememberMeStrategy(
	function (token, done) {
		consumeRememberMeToken(token, function (err, uid) {
			if (err) { return done(err); }
			if (!uid) { return done(null, false); }

			findById(uid, function (err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false); }
				return done(null, user);
			});
		});
	},
	issueToken
));
var tokens = {};
function consumeRememberMeToken(token, fn) {
	var uid = tokens[token];
	// invalidate the single-use token
	delete tokens[token];
	return fn(null, uid);
}

function issueToken(user, done) {
	var token = new mongodb.ObjectID();
	saveRememberMeToken(token.toString(), user.id, function (err) {
		if (err) { return done(err); }
		return done(null, token.toString());
	});
}


function saveRememberMeToken(token, uid, fn) {
	tokens[token] = uid;
	return fn();
}



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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("remember-me"));

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
