const express = require("express");
const {
  createNewUser,
  signIn,
  userProfile,
} = require("../controllers/userControllers");
const {
  checkIfEmailExists,
  validatePassword,
  authenticate,
  checkIfUsernameExist,
} = require("../middlewares/userMiddleware");

const routes = express.Router();

routes.post("/sign-up", createNewUser);

routes.post("/sign-in", [checkIfEmailExists, validatePassword], signIn);

routes.get(
  "/profile/:username",
  [authenticate, checkIfUsernameExist],
  userProfile
);

module.exports = routes;
