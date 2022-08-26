const { sequelize, User, Profile, Avatar, Refresher } = require("../../models");
const { errorMessage } = require("../utils/error");
const { sign, decode, verify } = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../utils/constant");

exports.createNewUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = await User.createUser({
      userData: req.body,
      transaction: t,
    });
    await Profile.createDefaultProfile({ userId: id, transaction: t });

    await t.commit();

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

  const payload = { id, email };
  const accessToken = sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "500s" });
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
  });

  return res.status(200).send({ accessToken });
};

exports.userProfile = async (req, res) => {
  const username = req.params.username;

  try {
    const profile = await User.findOne({
      where: { username },
      attributes: { exclude: ["password"] },
      include: [{ model: Profile }],
    });

    return res.send({ profile });
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
      expiresIn: "500s",
    });

    return res.status(200).send({ accessToken });
  });
};

exports.signOut = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.clearCookie("jwt", { httpOnly: true });
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
