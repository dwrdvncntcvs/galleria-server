const express = require("express");
const {
  createNewUser,
  signIn,
  userProfile,
  updateProfile,
  deleteUser,
  tokenRefresher,
  signOut,
  changeUserPassword,
  validateUser,
  userAccount,
  findUser,
  updateUserAccount,
} = require("../controllers/userControllers");
const {
  checkIfEmailExists,
  validatePassword,
  authenticate,
  checkIfUsernameExist,
  canEdit,
  checkNewPassword,
  checkIfUserIsVerified,
} = require("../middlewares/userMiddleware");

const routes = express.Router();

routes.post("/sign-up", [checkNewPassword], createNewUser);

routes.post(
  "/sign-in",
  [checkIfEmailExists, validatePassword, checkIfUserIsVerified],
  signIn
);

routes.post("/verify", [checkIfEmailExists], validateUser);

routes.get("/", [authenticate], userAccount);

routes.get("/profile/:username", [checkIfUsernameExist], userProfile);

routes.put("/update/profile/:userId", [authenticate, canEdit], updateProfile);

routes.delete("/:userId", [authenticate, canEdit], deleteUser);

routes.get("/refresh", tokenRefresher);

routes.get("/sign-out", signOut);

routes.put(
  "/change-password/:userId",
  [authenticate, validatePassword, checkNewPassword, canEdit],
  changeUserPassword
);

routes.get("/find-user", [authenticate], findUser);

routes.put("/account/:userId", [authenticate, canEdit], updateUserAccount);

module.exports = routes;
