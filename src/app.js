const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { sequelize } = require("../models");
const {
  userRoutes,
  avatarRoutes,
  followerRoutes,
  postRoutes,
  commentRoutes,
} = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/images/avatars", express.static("images/avatars"));

app.use("/user", userRoutes);
app.use("/avatar", avatarRoutes);
app.use(followerRoutes);
app.use(postRoutes);
app.use(commentRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  sequelize.authenticate();
  console.log("Connected to Database.");
});
