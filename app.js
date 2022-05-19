// core modules
const express = require("express");
const morgan = require("morgan");

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

module.exports = app;

///////////////////////////////////////////////////////////////////////////////////////
// Notes

// get method
// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Hello There", natour: "API" });
// });

// app.post("/", (req, res) => {
//   res.status(200).json({
//     message: "Got the post requestb",
//   });
// });

// Don't read data in the route handler
// Event loop will be stuck

// Route for all the tours data
// app.get("/api/v1/tours", getAllTours);
// //TO show a single tour
// app.get("/api/v1/tours/:id/:x?", getTourById);
// //Tour Creation
// app.post("/api/v1/tours", createTour);
// //update a tour by ID
// app.patch("/api/v1/tours/:id", updateTourById);

// ALternative way to have to routs
// app.route("/api/v1/tours").get(getAllTours).post(createTour);
// app.route("/api/v1/tours/:id").get(getTourById).patch(updateTourById);

// app.route("/api/v1/users").get(getAllUsers).post(createUser);
// app
//   .route("/api/v1/users/:id")
//   .get(getUserById)
//   .delete(deleteUserById)
//   .patch(updateUserById);
