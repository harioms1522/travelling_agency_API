/* eslint-disable import/no-dynamic-require */
// module imports
const express = require("express");

const tourController = require(`${__dirname}/../controllers/tourController`);

const authController = require("../controllers/authController")

const {
  getAllTours,
  createTour,
  getTourById,
  updateTourById,
  deleteTourById,
  topCheapTourHandler,
  getTourStats,
  getMonthPlan,
  // checkId,
  // checkBody, // important for middleware chaining and to check posr requests
} = tourController;

// Create a router for this resource
const router = express.Router();

// param middleware
// router.param("id", checkId); // this can be done by the mongo db giving errors

//**ALIAS ROUTES**
router.route("/top-cheapest-5").get(topCheapTourHandler, getAllTours);

// ** STATS TOUR**
// Aggregation Pipeline
router.route("/tour-stats").get(getTourStats);

// Aggregation for the monthwise detail
router.route("/tour-plan/:year").get(getMonthPlan);

// **ROUTES**
router
  .route("/")
  .get(authController.protect, getAllTours)
  .post(createTour);
router
  .route("/:id")
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

module.exports = router;
