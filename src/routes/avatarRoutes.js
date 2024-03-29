const express = require("express");
const {
  uploadAvatar,
  removeAvatar,
} = require("../controllers/avatarControllers");
const { authenticate, canEdit } = require("../middlewares/userMiddleware");
const { ImageService } = require("../services/imageServices");

const routes = express.Router();

const { upload } = new ImageService({
  storageType: process.env.M_S_TYPE,
  name: "avatar",
});

routes.post(
  "/:userId",
  [authenticate, canEdit, upload("single")],
  uploadAvatar
);

routes.delete("/:userId", [authenticate, canEdit], removeAvatar);

module.exports = routes;
