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
  isImageValid,
  isImagesValid,
  checkPostIfExist,
  userPostsPagination,
} = require("../middlewares/postMiddlewares");
const {
  authenticate,
  checkIfUsernameExist,
  canEdit,
  checkUserId,
} = require("../middlewares/userMiddleware");
const { TEXT } = require("../utils/constant");
const Image = require("../utils/images");

const upload = (type) => {
  return new Image({
    path: "images/posts",
    name: "imagePost",
    uploadType: type,
  }).upload();
};

const routes = express.Router();

routes.post(
  "/create-new-post/text",
  [authenticate, hasText(TEXT)],
  createTextPost
);

routes.post(
  "/create-new-post/image",
  [authenticate, upload("single"), isImageValid("images/posts")],
  createImagePost
);

routes.post(
  "/create-new-post/images",
  [authenticate, upload("array"), isImagesValid("images/posts/")],
  createImagesPost
);

routes.get(
  "/posts/:username",
  [checkIfUsernameExist, userPostsPagination],
  getUserPosts
);

routes.get("/posts", [checkUserId], getAllPosts);

routes.put(
  "/user/post",
  [authenticate, canEdit, checkPostIfExist],
  updatePostContent
);

module.exports = routes;
