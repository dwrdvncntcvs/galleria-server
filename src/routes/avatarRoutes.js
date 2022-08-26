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
const { ImageService } = require("../services/imageServices");

const routes = express.Router();

// const upload = new Image({
//   path: "images/avatars",
//   name: "avatar",
//   uploadType: "single",
// }).upload();

const { upload } = new ImageService({
  storageType: process.env.M_S_TYPE,
  name: "avatar",
});

routes.post(
  "/:userId",
  [
    authenticate,
    canEdit,
    upload("single"),
    isImageValid("images/avatars"),
    checkIfAvatarExist,
  ],
  uploadAvatar
);

routes.delete(
  "/:userId",
  [authenticate, canEdit, removeAvatarImage],
  removeAvatar
);

module.exports = routes;
