const express = require("express");
const {
  createTextPost,
  createImagePost,
  createImagesPost,
  getUserPosts,
  updatePostContent,
  getAllPosts,
} = require("../controllers/postController");
const {
  hasText,
  checkPostIfExist,
  userPostsPagination,
} = require("../middlewares/postMiddlewares");
const {
  authenticate,
  checkIfUsernameExist,
  canEdit,
  checkUserId,
} = require("../middlewares/userMiddleware");
const { ImageService } = require("../services/imageServices");
const { TEXT } = require("../utils/constant");

const { upload } = new ImageService({
  storageType: process.env.M_S_TYPE,
  name: "image-post",
});

const routes = express.Router();

routes.post("/text", [authenticate, hasText(TEXT)], createTextPost);

routes.post("/image", [authenticate, upload("single")], createImagePost);

routes.post("/images", [authenticate, upload("array")], createImagesPost);

routes.get(
  "/posts/:username",
  [checkIfUsernameExist, userPostsPagination],
  getUserPosts
);

routes.get("/posts", [checkUserId], getAllPosts);

routes.put(
  "/:userId/:postId",
  [authenticate, canEdit, checkPostIfExist],
  updatePostContent
);

module.exports = routes;
