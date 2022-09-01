const express = require("express");
const { createOTP } = require("../controllers/otpControllers");
const { authenticate } = require("../middlewares/userMiddleware");

const route = express.Router();

route.post("/email", [authenticate], createOTP);

module.exports = route;
