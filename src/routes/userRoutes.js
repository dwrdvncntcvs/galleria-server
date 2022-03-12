const express = require("express");
const { createNewUser } = require("../controllers/userControllers");
const {
  checkIfEmailExists,
  checkIfUsernameExist,
} = require("../middlewares/userMiddleware");

const routes = express.Router();

routes.post(
  "/sign-up",
  [checkIfUsernameExist, checkIfEmailExists],
  createNewUser
);

module.exports = routes;
