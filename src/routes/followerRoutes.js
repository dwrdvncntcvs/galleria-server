const express = require("express");
const { followUser } = require("../controllers/followerController");
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

module.exports = routes;
