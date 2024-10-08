var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv").config();
require("dotenv").config();
var authRouter = require("./routes/auth");
var appsRouter = require("./routes/apps");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var session = require("express-session");

var app = express();

// mongoDB connection to the week04 DB (DB to be updated)
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
mongoose.connect(url);

app.use(
  session({
    secret: "your_secret_key", // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use("/", appsRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", appsRouter);
app.use("/", authRouter);
app.use(express.static("uploads"));
app.use("/", indexRouter);
app.use("/users", usersRouter);

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
