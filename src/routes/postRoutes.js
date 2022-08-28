const express = require("express");
const {
  createTextPost,
  createImagePost,
  createImagesPost,
  getUserPosts,
  updatePostContent,
  getAllPosts,
  deletePost,
} = require("../controllers/postController");
const {
  hasText,
  checkPostIfExist,
  userPostsPagination,
  canEditPost,
} = require("../middlewares/postMiddlewares");
const {
  authenticate,
  checkIfUsernameExist,
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
  "/:postId",
  [authenticate, canEditPost, checkPostIfExist],
  updatePostContent
);

routes.delete("/:postId", [authenticate, canEditPost], deletePost);

module.exports = routes;
