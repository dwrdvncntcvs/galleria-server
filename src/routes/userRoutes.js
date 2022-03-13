const express = require("express");
const { createNewUser, signIn } = require("../controllers/userControllers");
const {
  checkIfEmailExists,
  validatePassword,
} = require("../middlewares/userMiddleware");

const routes = express.Router();

routes.post("/sign-up", createNewUser);

routes.post("/sign-in", [checkIfEmailExists, validatePassword], signIn);

module.exports = routes;
