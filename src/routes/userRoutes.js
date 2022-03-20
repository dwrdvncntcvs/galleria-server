const express = require("express");
const {
  createNewUser,
  signIn,
  userProfile,
  updateProfile,
  deleteUser,
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

routes.put("/update/profile/:id", [authenticate, canEdit], updateProfile);

routes.delete("/delete/user/:id", [authenticate, canEdit], deleteUser);

module.exports = routes;
