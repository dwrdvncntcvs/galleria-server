const express = require("express");
const {
  createTextComment,
  getComments,
  createImageComment,
} = require("../controllers/commentControllers");
const { checkPostIfExist } = require("../middlewares/postMiddlewares");
const { authenticate } = require("../middlewares/userMiddleware");
const { ImageService } = require("../services/imageServices");

const route = express.Router();

const { upload } = new ImageService({
  storageType: process.env.M_S_TYPE,
  name: "comment-image",
});

route.post(
  "/text/:postId",
  [authenticate, checkPostIfExist],
  createTextComment
);

route.post(
  "/image/:postId",
  [authenticate, checkPostIfExist, upload("single")],
  createImageComment
);

route.get("/:postId", [checkPostIfExist], getComments);

module.exports = route;
