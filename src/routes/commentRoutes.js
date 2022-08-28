const express = require("express");
const {
  createTextComment,
  getComments,
  createImageComment,
  updateComment,
} = require("../controllers/commentControllers");
const {
  checkIfCommentExists,
  canEditComment,
} = require("../middlewares/commentMiddlewares");
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

route.put(
  "/:commentId",
  [authenticate, checkIfCommentExists, canEditComment],
  updateComment
);

module.exports = route;
