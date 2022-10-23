// core modules
const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError")

// controllers
const globalErrorHandler = require("./controllers/errorController")

// Custom Modules
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// express is a function
const app = express();

// Middlewares
// 3rd party
// lets use morgan only when the environment is development for process
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json()); //existing

// Serving static files using middleware
app.use(express.static(`${__dirname}/public`));

//custom middleware
app.use((req, res, next) => {
  req.requestDate = new Date().toISOString();
  next();
});

// using the routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

// all other routs and all other htttp requests on then should return to 404 page
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware is to be defined in the end
app.use(globalErrorHandler);

module.exports = app;