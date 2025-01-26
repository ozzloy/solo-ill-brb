const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { environment } = require("./config");
const isProduction = environment === "production";

const app = express();

app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  }),
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  }),
);

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const sessionRoutes = require("./routes/api/session");
app.use("/api/session", sessionRoutes);

const userRoutes = require("./routes/api/users");
app.use("/api/users", userRoutes);

const spotRoutes = require("./routes/api/spots");
app.use("/api/spots", spotRoutes);

const reviewRoutes = require("./routes/api/reviews");
app.use("/api/reviews", reviewRoutes);

const bookingRoutes = require("./routes/api/bookings");
app.use("/api/bookings", bookingRoutes);

const reviewImageRoutes = require("./routes/api/review-images");
app.use("/api/review-images", reviewImageRoutes);

const spotImageRoutes = require("./routes/api/spot-images");
app.use("/api/spot-images", spotImageRoutes);

app.use((_req, _res, next) => {
  const err = new Error("The requested resources couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = {
    message: "The requested resource couldn't be found.",
  };
  err.status = 404;
  next(err);
});

const { ValidationError } = require("sequelize");

//Process sequelize errors
app.use((err, _req, _res, next) => {
  //check if error is a sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.errors = errors;
  }
  next(err);
});

//Error formater
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
