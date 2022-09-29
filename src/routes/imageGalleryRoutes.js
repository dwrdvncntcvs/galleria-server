const express = require("express");
const { getGallery } = require("../controllers/imageGalleryController");
const { checkIfUsernameExist } = require("../middlewares/userMiddleware");

const route = express.Router();

route.get("/:username", [checkIfUsernameExist], getGallery);

module.exports = route;
