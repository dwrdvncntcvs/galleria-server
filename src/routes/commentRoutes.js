const express = require("express");
const { createTextComment, getComments } = require("../controllers/commentControllers");
const { checkPostIfExist } = require("../middlewares/postMiddlewares");
const { authenticate } = require("../middlewares/userMiddleware");

const route = express.Router();

route.post("/text/:postId", [authenticate, checkPostIfExist], createTextComment);

route.get("/:postId", [checkPostIfExist], getComments)

module.exports = route;
