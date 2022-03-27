const express = require("express");
const { createTextPost } = require("../controllers/postController");
const { authenticate } = require("../middlewares/userMiddleware");

const routes = express.Router();

routes.post("/create-new-post/text", [authenticate], createTextPost);

module.exports = routes;
