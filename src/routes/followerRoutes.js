const express = require("express");
const {
  followUser,
  getFollower,
  getFollowing,
} = require("../controllers/followerController");
const { canFollow } = require("../middlewares/followerMiddlewares");
const {
  authenticate,
  checkIfUsernameExist,
} = require("../middlewares/userMiddleware");

const routes = express.Router();

routes.post(
  "/follow/:username",
  [authenticate, checkIfUsernameExist, canFollow],
  followUser
);

routes.get(
  "/:username/follower",
  [authenticate, checkIfUsernameExist],
  getFollower
);

routes.get(
  "/:username/following",
  [authenticate, checkIfUsernameExist],
  getFollowing
);

module.exports = routes;
