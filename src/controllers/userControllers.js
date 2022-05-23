const { sequelize, User, Profile, Avatar, Refresher } = require("../../models");
const { errorMessage } = require("../utils/error");
const { sign } = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/constant");
const verify = require("jsonwebtoken/verify");

exports.createNewUser = async (req, res) => {
  const { first_name, last_name, username, email, password } = req.body;

  const t = await sequelize.transaction();
  try {
    const user = await User.create(
      { first_name, last_name, username, email, password },
      { transaction: t }
    );

    await Profile.create({ userId: user.id, bio: "" }, { transaction: t });

    await Avatar.create({ userId: user.id }, { transaction: t });

    await Refresher.create(
      { userId: user.id, refreshToken: "" },
      { transaction: t }
    );
    await t.commit();

    return res.status(200).send({ msg: "Account created." });
  } catch (err) {
    const { status, msg } = errorMessage(err);
    await t.rollback();
    return res.status(status).send({ msg });
  }
};

exports.signIn = (req, res) => {
  const { id, email } = req.currentUser;

  const payload = { id, email };
  const token = sign(payload, SECRET_KEY);

  return res.status(200).send({ token });
};

exports.userProfile = async (req, res) => {
  const username = req.params.username;

  try {
    const profile = await User.findOne({
      where: { username },
      attributes: { exclude: ["password"] },
      include: [{ model: Profile }, { model: Avatar }],
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
  const id = req.query.userId;

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
