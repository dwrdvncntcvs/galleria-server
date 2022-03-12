const express = require("express");
const cors = require("cors");
const { sequelize } = require("../models");
const { userRoutes } = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  sequelize.authenticate();
  console.log("Connected to Database.");
});
