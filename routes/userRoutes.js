/* eslint-disable import/no-dynamic-require */
// Module imports
const express = require("express");

// controllers
const userController = require(`${__dirname}/../controllers/userController`);
const authController = require("../controllers/authController")


const router = express.Router(); // this is like a middleware so we have to use it with the main app in different paths

// Routes related to auth
router.post("/signup", authController.signup)
router.post("/login", authController.login)


// For all resource
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
// Select resource 
router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;
