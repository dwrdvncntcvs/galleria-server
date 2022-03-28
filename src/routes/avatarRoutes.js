const express = require("express");
const {
  uploadAvatar,
  removeAvatar,
} = require("../controllers/avatarControllers");
const {
  checkIfAvatarExist,
  removeAvatarImage,
} = require("../middlewares/avatarMiddlewares");
const { isImageValid } = require("../middlewares/postMiddlewares");
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
  [
    authenticate,
    canEdit,
    upload,
    isImageValid("images/avatars"),
    checkIfAvatarExist,
  ],
  uploadAvatar
);

routes.delete(
  "/remove-avatar/user/:id",
  [authenticate, canEdit, removeAvatarImage],
  removeAvatar
);

module.exports = routes;
