/* eslint-disable import/no-dynamic-require */
// Module imports
const express = require("express");

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require(`${__dirname}/../controllers/userController`);
// Since we have now two resources we can get sub applicatiosn for them or the routers
const router = express.Router(); // this is like a middleware so we have to use it with the main app in different paths

//middleware
router.param("id", (req, res, next, val) => {
  console.log(val);
  next();
});

router.route("/").get(getAllUsers).post(createUser);
router
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = router;
