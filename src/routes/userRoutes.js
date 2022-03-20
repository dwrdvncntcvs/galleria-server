const express = require("express");
const {
  createNewUser,
  signIn,
  userProfile,
  updateProfile,
} = require("../controllers/userControllers");
const {
  checkIfEmailExists,
  validatePassword,
  authenticate,
  checkIfUsernameExist,
  canEdit,
} = require("../middlewares/userMiddleware");

const routes = express.Router();

routes.post("/sign-up", createNewUser);

routes.post("/sign-in", [checkIfEmailExists, validatePassword], signIn);

routes.get(
  "/profile/:username",
  [authenticate, checkIfUsernameExist],
  userProfile
);

routes.put(
  "/update/profile/:id",
  [authenticate, canEdit],
  updateProfile
);

module.exports = routes;
