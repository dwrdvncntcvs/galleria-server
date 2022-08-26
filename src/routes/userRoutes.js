const express = require("express");
const {
  createNewUser,
  signIn,
  userProfile,
  updateProfile,
  deleteUser,
  tokenRefresher,
  signOut,
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

routes.put("/update/profile/:userId", [authenticate, canEdit], updateProfile);

routes.delete("/:userId", [authenticate, canEdit], deleteUser);

routes.get("/refresh", tokenRefresher);

routes.get("/sign-out", signOut);

module.exports = routes;
