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
  otpRoutes,
  imageGalleryRoutes,
} = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://galleria.pages.dev"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/images/avatars", express.static("images/avatars"));

app.use("/user", userRoutes);
app.use("/avatar", avatarRoutes);
app.use(followerRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/otp", otpRoutes);
app.use("/gallery", imageGalleryRoutes)

app.use((error, req, res, next) => {
  return res.status(500).send({ msg: error.message });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  sequelize.authenticate();
  console.log("Connected to Database.");
});
