const express = require("express");
const cors = require("cors");
const { sequelize } = require("../models");
const { userRoutes, avatarRoutes, followerRoutes } = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/images/avatars", express.static("images/avatars"));

app.use(userRoutes);
app.use(avatarRoutes);
app.use(followerRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  sequelize.authenticate();
  console.log("Connected to Database.");
});
