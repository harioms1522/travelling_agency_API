/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-console */
// const fs = require("fs");

//models
const Tour = require("../models/tourModel");

// API Features
const APIFeatures = require("../utils/apiFeaturesGet");
// data
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// **MIDDLEWARES**-

// Functions that are repeated again and perform on the param
// param middleware function
// const checkId = (req, res, next, val) => {
//   if (val * 1 > tours.length) {
//     return res.status(400).json({
//       status: "Not Found",
//     });
//   }
//   next();
// };

const topCheapTourHandler = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,difficulty,summary,ratingsAverage";
  next();
};

const checkBody = (req, res, next) => {
  //   const bodyDataKeys = Object.keys(req.body);
  //   console.log(bodyDataKeys);
  //if (!(bodyDataKeys.includes("name") && bodyDataKeys.includes("price")))
  if (!req.body.name || !req.body.price) {
    return res.status(500).json({
      status: "Wrong Params sent in body",
    });
  }
  next();
};

// Request Handlers
// const getAllTours = (req, res) => {
//   res.status(200).json({
//     status: "success",
//     requestTime: req.requestDate,
//     results: tours.length,
//     data: { tours: tours },
//   });
// };

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// This implementation is for notes purposes ////////////////////////
// get all tours using mongoose
const getAllTours = async function (req, res) {
  try {
    // console.log(req.query);

    //     //1A) in this shallow copy we will be deleting the keys that are for other purposes
    //     const queryStringObj = { ...req.query };
    //     const excludedFields = ["page", "sort", "limit", "fields"];
    //     excludedFields.forEach((curr) => {
    //       delete queryStringObj[curr];
    //     });

    //     // console.log(req.query, queryStringObj);

    //     // We should not use it with await because then we can not get the access to other query methods
    //     // const allTours = await Tour.find(queryString); // if we dont provif rthe parameters too this function then it returns all docs in the collection

    //     // for gte logic : {difficulty:"easy","duration":{$gte:5}}
    //     // using ?difficulty=easy&duration[gte]=5 : { difficulty: 'medium', duration: { gte: '4' } }
    //     // So making the right string and queryObject
    //     // 1A) Advanced gte lte etc query
    //     let queryString = JSON.stringify(queryStringObj);
    //     queryString = queryString.replace(
    //       /\b(gte|gt|lte|lt)\b/g,
    //       (match) => `$${match}`
    //     );
    //     // console.log(JSON.parse(queryString));

    //     // we can make a query and the await that because all the query methods can work on promises
    //     let query = Tour.find(JSON.parse(queryString));

    //     //2) Sorting
    //     if (req.query.sort) {
    //       const sortBy = req.query.sort.split(",").join(" ");
    //       query = query.sort(sortBy);
    //     } else {
    //       query = query.sort("-createdAt");
    //     }

    //     // 3) Projecting the fields if the query has the fields keyword
    //     if (req.query.fields) {
    //       const projectBy = req.query.fields.split(",").join(" ");
    //       query = query.select(projectBy);
    //     } else {
    //       query = query.select("-__v");
    //     }

    //     // 4) Pagination
    //     // We want this to happen always
    //     const page = req.query.page * 1 || 1;
    //     const limit = req.query.limit * 1 || 2;
    //     const skip = (page - 1) * limit;

    //     //if page is really mentioned then we can check for the rror
    //     if (req.query.page) {
    //       const numDocs = await Tour.countDocuments();
    //       if (skip > numDocs) throw new Error("This page doesn't exist!");
    //     }

    //     query = query.skip(skip).limit(limit);

    // ** EXECUTE QUERY  **
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // await the results to get the promise resolved into value
    const allTours = await features.query;

    // We can also us the methods on the obj returned by find method on model
    // const query = Tour.find()
    //   .where("difficulty")
    //   .equals("easy")
    //   .where("duration")
    //   .equals(5);

    res.status(200).json({
      status: "Success",
      requestTime: req.requestDate,
      results: allTours.length,
      data: { allTours },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      data: { err },
    });
  }
};

// const getTourById = (req, res) => {
//   //   console.log(req.params);
//   const { id: tourID } = req.params;

//   const data = tours.find((curr) => curr.id === 1 * tourID); //to make it a number

//   res.status(200).json({
//     status: "Success",
//     requestTime: req.requestDate,
//     data, //new object literals
//   });
// };

// using the mongoose driver
const getTourById = async function (req, res) {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      requestTime: req.requestDate,
      tour, //new object literals
    });
  } catch (err) {
    res.status(403).json({
      status: "failed",
      data: { err },
    });
  }
};

// const createTour = (req, res) => {
//   // using the database driver and models in mongoose
//   const data = req.body;
//   // Crating new document using the model form tourmodel.js
//   const document = new Tour(data);
//   document
//     .save()
//     .then((doc) => {
//       console.log(doc);
//       res.status(200).json({
//         staus: "Success",
//         message: "Successfully created a new tour",
//         data: { doc },
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(401).json({
//         staus: "Not Created",
//         data: { err },
//       });
//     });
// Using the file method to have to data
//   console.log(req.body);
// const id = tours.at(-1).id + 1;
// const newTour = Object.assign({ id: id }, req.body);
// tours.push(newTour);

// fs.writeFile(
//   `${__dirname}/../dev-data/data/tours-simple.json`,
//   JSON.stringify(tours),
//   (err) => {
//     console.log(err);
//     res.status(201).json({
//       staus: "Success",
//       message: "Successfully created a new tour",
//       data: { newTour },
//     });
// }
// );
// };

// We can also use a new syntax
const createTour = async function (req, res) {
  try {
    // Using async await to handle to promise returning functions
    // catching error using try and catch
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      staus: "Success",
      message: "Successfully created a new tour",
      data: { newTour },
    });
  } catch (err) {
    res.status(403).json({
      staus: "Not Created",
      data: { err },
    });
  }
};

// const updateTourById = (req, res) => {
//   const { id: tourId } = req.params;
//   const data = req.body;
//   tours.forEach((element, index, arr) => {
//     if (element.id === 1 * tourId) {
//       arr[index] = data;
//     }
//   });
//   //   We can alos write this data and check if the id is not greter then the last index of tours array
//   res.status(200).json({
//     status: "Success",
//     data: { tours },
//   });
// };

const updateTourById = async function (req, res) {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      staus: "Success",
      message: "Successfully created a new tour",
      data: { tour },
    });
  } catch (err) {
    res.status(403).json({
      staus: "Not Created",
      data: { err },
    });
  }
};

const deleteTourById = async function (req, res) {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    console.log("here")
    res.status(204).json({
      staus: "Success",
      message: "Successfully deleted the tour",
      data: { deletedTour },
    });
  } catch (err) {
    res.status(403).json({
      staus: "Not deleted",
      data: { err },
    });
  }
};

// ///////////////////////////////////////////////////////////////
// Statistic Handlers

const getTourStats = async function (req, res) {
  console.log("hello");
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: "$difficulty",
          num: { $sum: 1 },
          totalNumRatings: { $sum: "$ratingsQuantity" },
          averageRating: { $avg: "$ratingsAverage" },
          averagePrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { averagePrice: 1 } },
    ]);
    res.status(200).json({
      staus: "Success",
      message: "Statistical Info Descriptive",
      data: { stats },
    });
  } catch (err) {
    res.status(403).json({
      staus: "Not Created",
      data: { err },
    });
  }
};

const getMonthPlan = async function (req, res) {
  const year = req.params.year * 1;
  try {
    const plan = await Tour.aggregate([
      { $project: { _id: 0, name: 1, startDates: 1 } },
      { $unwind: "$startDates" },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year},1,1`),
            $lte: new Date(`${year},12,31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          count: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      { $addFields: { month: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { count: 1 } },
    ]);
    res.status(200).json({
      staus: "Success",
      message: "Statistical Info Descriptive",
      data: { plan },
    });
  } catch (err) {
    res.status(403).json({
      staus: "Not Created",
      data: { err },
    });
  }
};

module.exports = {
  getAllTours,
  createTour,
  getTourById,
  updateTourById,
  deleteTourById,
  topCheapTourHandler,
  getTourStats,
  getMonthPlan,
  // checkId,
  checkBody,
};
