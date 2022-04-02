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

routes.get("/profile/:username", [checkIfUsernameExist], userProfile);

routes.put("/update/profile", [authenticate, canEdit], updateProfile);

routes.delete("/delete/user", [authenticate, canEdit], deleteUser);

module.exports = routes;
