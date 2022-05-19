/* eslint-disable no-console */
const dotenv = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("../models/tourModel");

// configuring config.env
dotenv.config({ path: "../config.env" });

// getting the data
const data = JSON.parse(fs.readFileSync("./data/tours-simple.json", "utf-8"));
// console.log(data);

// connecting to mongodb using mongoose
// Configuring the db connection
const connectionStr = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// connection to the database hosted on atlas of mongodb
mongoose
  .connect(connectionStr, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("Database connected");
  });

const importData = async function (dataArray) {
  try {
    await Tour.create(dataArray);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async function () {
  try {
    await Tour.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  console.log(process.argv);
  importData(data);
  console.log("DB data imported");
} else if (process.argv[2] === "--emptyCollection") {
  deleteData();
  console.log("DB data deleted");
}
