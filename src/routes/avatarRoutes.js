const express = require("express");
const {
  uploadAvatar,
  removeAvatar,
} = require("../controllers/avatarControllers");
const {
  checkIfAvatarExist,
  removeAvatar,
} = require("../middlewares/avatarMiddlewares");
const { authenticate, canEdit } = require("../middlewares/userMiddleware");
const Image = require("../utils/images");

const routes = express.Router();

const upload = new Image({
  path: "images/avatars",
  name: "avatar",
  uploadType: "single",
}).upload();

routes.post(
  "/add-avatar/:id",
  [authenticate, canEdit, upload, checkIfAvatarExist],
  uploadAvatar
);

routes.delete(
  "/update-avatar/user/:id",
  [authenticate, canEdit, removeAvatar],
  removeAvatar
);

module.exports = routes;
