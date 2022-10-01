const { sequelize, User, Profile, Otp, Follower } = require("../../models");
const { errorMessage } = require("../utils/error");
const { sign, decode, verify } = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  OTP_TOKEN_SECRET,
} = require("../utils/constant");
const { generateOtp } = require("../services/otpService");
const { sendOtpVerificationEmail } = require("../services/mailingService");

exports.createNewUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const user = await User.createUser({
      userData: req.body,
      transaction: t,
    });

    const otp = generateOtp();

    const otpToken = sign({ otp, userId: user.id }, OTP_TOKEN_SECRET, {
      expiresIn: "5mins",
    });

    await Profile.createDefaultProfile({ userId: user.id, transaction: t });

    await Otp.createOtpToken({
      token: otpToken,
      userId: user.id,
      transaction: t,
    });

    await t.commit();

    await sendOtpVerificationEmail(user, otp);
    return res.status(200).send({ msg: "Account created." });
  } catch (err) {
    console.log(err);
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};

exports.signIn = async (req, res) => {
  const { id, email } = req.currentUser;
  delete req.currentUser["dataValues"]["password"];

  const payload = { id, email };
  const accessToken = sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
  const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "365d",
  });

  const t = await sequelize.transaction();

  await User.setRefreshToken({
    token: refreshToken,
    userId: id,
    transaction: t,
  });
  await t.commit();

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
  });

  return res.status(200).send({ accessToken });
};

exports.validateUser = async (req, res) => {
  const { otp } = req.body;
  const user = req.currentUser;

  const otpData = await Otp.findOtpTokenByUserId(user.id);
  const t = await sequelize.transaction();

  if (!otpData) return res.status(404).send({ msg: "Otp token not found" });

  verify(otpData.otp, OTP_TOKEN_SECRET, async (err, payload) => {
    try {
      if (err) {
        console.log(err);

        return res
          .status(400)
          .send({ msg: "OTP Token error", err: err.message });
      }

      if (payload.otp !== otp)
        return res.status(403).send({ msg: "Invalid OTP Code" });

      if (user.verified)
        return res.status(200).send({ msg: "Account already verified" });

      User.verifyUser({ userId: payload.userId, transaction: t });
      await t.commit();

      return res.status(200).send({ msg: "Account verified successfully." });
    } catch (err) {
      console.log(err);
      await t.rollback();
      return res.status(500).send({ msg: "Something went wrong." });
    }
  });
};

exports.userAccount = async (req, res) => {
  const user = req.user;

  try {
    const profile = await User.getUserProfileByUsername(user.username);

    return res.send({ profile });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong." });
  }
};

exports.userProfile = async (req, res) => {
  const username = req.params.username;

  try {
    const profile = await User.getUserProfileByUsername(username);

    const { count: followersCount } = await Follower.getFollowers(profile.id);
    const { count: followingCount } = await Follower.getFollowing(profile.id);

    return res.send({
      profile,
      followingCount: followingCount,
      followersCount,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: "Something went wrong." });
  }
};

exports.updateProfile = async (req, res) => {
  const id = req.query.userId;
  const { first_name, last_name, username, bio } = req.body;

  const t = await sequelize.transaction();
  try {
    await User.update(
      { first_name, last_name, username },
      { where: { id } },
      { transaction: t }
    );

    await Profile.update(
      { bio },
      { where: { userId: id } },
      { transaction: t }
    );

    await t.commit();
    return res.status(200).send({ msg: "Profile Updated." });
  } catch (err) {
    const { status, msg } = errorMessage(err);
    return res.status(status).send({ msg });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.userId;

  const t = await sequelize.transaction();
  try {
    await User.destroy({ where: { id } }, { transaction: t });
    await t.commit();

    return res.status(200).send({ msg: "User Deleted." });
  } catch (err) {
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong." });
  }
};

exports.tokenRefresher = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(403).send({ msg: "Forbidden" });
  const refreshToken = req.cookies.jwt;
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  const { id } = decode(refreshToken);

  const foundToken = await User.getRefreshTokenByUserId(id);

  if (!foundToken) return res.status(404).send({ msg: "User Not Found" });

  if (foundToken.refreshToken === "")
    return res.status(403).send({ msg: "Forbidden" });

  verify(refreshToken, REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err || payload.id !== foundToken.id)
      return res.status(401).send({ msg: "Invalid Credentials" });

    const dataObj = { id: payload.id, email: payload.email };

    const accessToken = sign(dataObj, ACCESS_TOKEN_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).send({ accessToken });
  });
};

exports.signOut = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.status(200).send({ msg: "Sign out successfully." });
  }

  const refreshToken = cookies.jwt;

  try {
    const t = await sequelize.transaction();

    const foundToken = await User.getRefreshToken(refreshToken);
    if (!foundToken) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.status(200).send({ msg: "Sign out successfully." });
    }

    await User.removeRefreshTokenByUserId({
      userId: foundToken.id,
      transaction: t,
    });

    await t.commit();
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(200).send({ msg: "Sign out successfully." });
  } catch (err) {
    console.log(err);
    await t.rollback();
    return res.status(500).send({ msg: "Something went wrong" });
  }
};

exports.changeUserPassword = async (req, res) => {
  const { newPassword } = req.body;
  const user = req.user;

  const t = await sequelize.transaction();
  try {
    await User.changeUserPassword({
      password: newPassword,
      userId: user.id,
      transaction: t,
    });
    await t.commit();

    return res.status(200).send({ msg: "Password changed successfully." });
  } catch (err) {
    console.log(err);
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg, err: err.message });
  }
};
