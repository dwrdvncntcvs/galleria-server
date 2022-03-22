const express = require("express");
const { uploadAvatar } = require("../controllers/avatarControllers");
const { checkIfAvatarExist } = require("../middlewares/avatarMiddlewares");
const { authenticate } = require("../middlewares/userMiddleware");
const Image = require("../utils/images");

const routes = express.Router();

const upload = new Image({
  path: "images/avatars",
  name: "avatar",
  uploadType: "single",
}).upload();

routes.post(
  "/add-avatar/:userId",
  [authenticate, upload, checkIfAvatarExist],
  uploadAvatar
);

module.exports = routes;
