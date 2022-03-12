const express = require("express");
const { createNewUser } = require("../controllers/userControllers");

const routes = express.Router();

routes.post("/sign-up", createNewUser);

module.exports = routes;
