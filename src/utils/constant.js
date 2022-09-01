require("dotenv").config();

module.exports = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  OTP_TOKEN_SECRET: process.env.OTP_TOKEN_SECRET,
  GOOGLE_CRED: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    user: process.env.GOOGLE_USER,
    password: process.env.GOOGLE_PASSWORD,
  },
  TEXT: "text",
  IMAGE: "image",
  JPG: "jpg",
  JPEG: "jpeg",
  PNG: "png",
};
