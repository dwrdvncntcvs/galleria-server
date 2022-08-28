const express = require("express");
const { createTextComment } = require("../controllers/commentControllers");
const { checkPostIfExist } = require("../middlewares/postMiddlewares");
const { authenticate } = require("../middlewares/userMiddleware");

const route = express.Router();

route.post("/text/:postId", [authenticate, checkPostIfExist], createTextComment);

module.exports = route;
