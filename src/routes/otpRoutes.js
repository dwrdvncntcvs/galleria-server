const express = require("express");
const { createOTP } = require("../controllers/otpControllers");
const { checkIfEmailExists } = require("../middlewares/userMiddleware");

const route = express.Router();

route.post("/email", [checkIfEmailExists], createOTP);

module.exports = route;
