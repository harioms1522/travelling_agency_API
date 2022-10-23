const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync")

// request handlers
exports.getAllUsers =  catchAsync(async (req, res) => {
  const users = await User.find({})
  
  res.status(200).json({
    status: "success",
    data: users
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not yet implemented",
  });
};

exports.updateUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not yet implemented",
  });
};

exports.deleteUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not yet implemented",
  });
};

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Route not yet implemented",
  });
};
