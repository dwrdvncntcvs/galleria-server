const express = require("express");
const cors = require("cors");
const { sequelize } = require("../models");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  sequelize.authenticate();
  console.log("Connected to Database.");
});
